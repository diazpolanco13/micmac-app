/**
 * 🚀 API Routes - Proyecto Individual
 * CRUD para proyecto específico por ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject, transitionProjectStatus } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ProjectType, ProjectStatus } from '@prisma/client'

// GET /api/projects/[id] - Obtener proyecto por ID
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
      data: project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Actualizar proyecto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, type, expectedExperts, tags, isPublic, status, statusReason, statusNotes } = body

    // Validaciones
    if (name && (name.trim().length === 0 || name.length > 250)) {
      return NextResponse.json(
        { success: false, error: 'Nombre inválido (1-250 caracteres)' },
        { status: 400 }
      )
    }

    if (type && !Object.values(['STRATEGIC', 'TECHNOLOGICAL', 'ENVIRONMENTAL', 'SOCIAL', 'ECONOMIC']).includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de proyecto inválido' },
        { status: 400 }
      )
    }

    if (expectedExperts && (expectedExperts < 3 || expectedExperts > 50)) {
      return NextResponse.json(
        { success: false, error: 'Número de expertos debe estar entre 3 y 50' },
        { status: 400 }
      )
    }

    // Si se está cambiando el estado, usar transición
    if (status) {
      const project = await transitionProjectStatus(
        id,
        status as ProjectStatus,
        user.id,
        statusReason,
        statusNotes
      )

      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Error al cambiar estado del proyecto' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        data: project,
        message: 'Estado del proyecto actualizado exitosamente'
      })
    }

    // Actualización normal del proyecto
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim()
    if (type !== undefined) updateData.type = type as ProjectType
    if (expectedExperts !== undefined) updateData.expectedExperts = expectedExperts
    if (tags !== undefined) updateData.tags = tags
    if (isPublic !== undefined) updateData.isPublic = isPublic

    const project = await updateProject(id, updateData)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Error al actualizar proyecto' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Proyecto actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Eliminar proyecto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar que el proyecto existe
    const project = await getProjectById(id)
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos (solo el creador o un moderador puede eliminar)
    if (project.creatorId !== user.id) {
      // TODO: Verificar si es moderador cuando tengamos la tabla de usuarios
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para eliminar este proyecto' },
        { status: 403 }
      )
    }

    const success = await deleteProject(id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Error al eliminar proyecto' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Proyecto eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
