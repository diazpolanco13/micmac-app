/**
 * 🚀 API Routes - Variables de Proyecto
 * CRUD para variables de un proyecto específico
 */

import { NextRequest, NextResponse } from 'next/server'
import { createVariable, updateVariable, deleteVariable, reorderVariables } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getProjectById } from '@/lib/database'

// GET /api/projects/[id]/variables - Obtener variables del proyecto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const project = await getProjectById(id)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project.variables
    })
  } catch (error) {
    console.error('Error fetching variables:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener variables',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/variables - Crear nueva variable
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { id: projectId } = params
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar que el proyecto existe
    const project = await getProjectById(projectId)
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, description, order, category, color } = body

    // Validaciones
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la variable es requerido' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'El nombre no puede exceder 100 caracteres' },
        { status: 400 }
      )
    }

    // Verificar límite de variables (metodología MIC MAC: 3-10)
    if (project.variables.length >= 10) {
      return NextResponse.json(
        { success: false, error: 'Máximo 10 variables permitidas por la metodología MIC MAC' },
        { status: 400 }
      )
    }

    const variable = await createVariable({
      projectId,
      name: name.trim(),
      description: description?.trim(),
      order: order || project.variables.length,
      category: category || null,
      color: color || null
    })

    return NextResponse.json({
      success: true,
      data: variable,
      message: 'Variable creada exitosamente'
    })
  } catch (error) {
    console.error('Error creating variable:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear variable',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/variables - Reordenar variables
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { id: projectId } = params
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { variableOrders } = body

    if (!Array.isArray(variableOrders)) {
      return NextResponse.json(
        { success: false, error: 'Formato de reordenamiento inválido' },
        { status: 400 }
      )
    }

    const success = await reorderVariables(projectId, variableOrders)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Error al reordenar variables' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Variables reordenadas exitosamente'
    })
  } catch (error) {
    console.error('Error reordering variables:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al reordenar variables',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
