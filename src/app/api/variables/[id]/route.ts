/**
 * 🚀 API Routes - Variable Individual
 * CRUD para variable específica por ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateVariable, deleteVariable } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

// PUT /api/variables/[id] - Actualizar variable
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

    // Verificar que la variable existe
    const existingVariable = await prisma.variable.findUnique({
      where: { id },
      include: { project: true }
    })

    if (!existingVariable) {
      return NextResponse.json(
        { success: false, error: 'Variable no encontrada' },
        { status: 404 }
      )
    }

    // Verificar permisos (solo el creador del proyecto puede editar)
    if (existingVariable.project.creatorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para editar esta variable' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, category, color } = body

    // Validaciones
    if (name !== undefined && (name.trim().length === 0 || name.length > 100)) {
      return NextResponse.json(
        { success: false, error: 'Nombre inválido (1-100 caracteres)' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description?.trim()
    if (category !== undefined) updateData.category = category
    if (color !== undefined) updateData.color = color

    const variable = await updateVariable(id, updateData)

    if (!variable) {
      return NextResponse.json(
        { success: false, error: 'Error al actualizar variable' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: variable,
      message: 'Variable actualizada exitosamente'
    })
  } catch (error) {
    console.error('Error updating variable:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar variable',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/variables/[id] - Eliminar variable
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

    // Verificar que la variable existe y obtener proyecto
    const existingVariable = await prisma.variable.findUnique({
      where: { id },
      include: { 
        project: {
          include: {
            variables: true
          }
        }
      }
    })

    if (!existingVariable) {
      return NextResponse.json(
        { success: false, error: 'Variable no encontrada' },
        { status: 404 }
      )
    }

    // Verificar permisos
    if (existingVariable.project.creatorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para eliminar esta variable' },
        { status: 403 }
      )
    }

    // Verificar metodología MIC MAC (mínimo 3 variables)
    if (existingVariable.project.variables.length <= 3) {
      return NextResponse.json(
        { success: false, error: 'No se puede eliminar: mínimo 3 variables requeridas por la metodología MIC MAC' },
        { status: 400 }
      )
    }

    const success = await deleteVariable(id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Error al eliminar variable' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Variable eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting variable:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar variable',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
