/**
 * 🚀 API Routes - Proyectos
 * CRUD completo para gestión de proyectos MIC MAC
 */

import { NextRequest, NextResponse } from 'next/server'
import { createProject, getProjects } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ProjectType } from '@prisma/client'

// GET /api/projects - Obtener todos los proyectos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.getAll('status')
    const search = searchParams.get('search')
    const tags = searchParams.getAll('tags')
    const creatorId = searchParams.get('creatorId')

    const projects = await getProjects({
      status: status.length > 0 ? status as any[] : undefined,
      search: search || undefined,
      tags: tags.length > 0 ? tags : undefined,
      creatorId: creatorId || undefined
    })

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener proyectos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/projects - Crear nuevo proyecto
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
    const { name, description, type, expectedExperts } = body

    // Validaciones básicas
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El nombre del proyecto es requerido' },
        { status: 400 }
      )
    }

    if (name.length > 250) {
      return NextResponse.json(
        { success: false, error: 'El nombre no puede exceder 250 caracteres' },
        { status: 400 }
      )
    }

    if (!type || !Object.values(['STRATEGIC', 'TECHNOLOGICAL', 'ENVIRONMENTAL', 'SOCIAL', 'ECONOMIC']).includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de proyecto inválido' },
        { status: 400 }
      )
    }

    if (!expectedExperts || expectedExperts < 3 || expectedExperts > 50) {
      return NextResponse.json(
        { success: false, error: 'Número de expertos debe estar entre 3 y 50' },
        { status: 400 }
      )
    }

    const project = await createProject({
      name: name.trim(),
      description: description?.trim() || '',
      type: type as ProjectType,
      expectedExperts: expectedExperts,
      creatorId: user.id
    })

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Proyecto creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
