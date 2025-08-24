/**
 * 🚀 API Routes - Expertos
 * CRUD completo para gestión de expertos
 */

import { NextRequest, NextResponse } from 'next/server'
import { getExperts, createExpert } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/experts - Obtener todos los expertos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const expertiseAreas = searchParams.getAll('expertiseAreas')

    const experts = await getExperts({
      search: search || undefined,
      expertiseAreas: expertiseAreas.length > 0 ? expertiseAreas : undefined
    })

    return NextResponse.json({
      success: true,
      data: experts,
      count: experts.length
    })
  } catch (error) {
    console.error('Error fetching experts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener expertos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/experts - Crear nuevo experto
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, organization, expertiseAreas, avatar, yearsExperience, notes } = body

    // Validaciones básicas
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El nombre del experto es requerido' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email válido es requerido' },
        { status: 400 }
      )
    }

    if (!expertiseAreas || !Array.isArray(expertiseAreas) || expertiseAreas.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Al menos un área de expertise es requerida' },
        { status: 400 }
      )
    }

    if (yearsExperience !== undefined && (yearsExperience < 0 || yearsExperience > 50)) {
      return NextResponse.json(
        { success: false, error: 'Años de experiencia debe estar entre 0 y 50' },
        { status: 400 }
      )
    }

    const expert = await createExpert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organization: organization?.trim(),
      expertiseAreas: expertiseAreas.map((area: string) => area.trim()),
      avatar: avatar?.trim(),
      yearsExperience: yearsExperience || undefined,
      notes: notes?.trim()
    })

    return NextResponse.json({
      success: true,
      data: expert,
      message: 'Experto creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating expert:', error)
    
    // Manejar error de email duplicado
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un experto con este email' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear experto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
