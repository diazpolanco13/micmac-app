'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { 
  ClipboardDocumentListIcon, 
  WrenchScrewdriverIcon, 
  UsersIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline'

export type TabId = 'general' | 'variables' | 'experts' | 'scheduling'

interface TabConfig {
  id: TabId
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface TabsNavigationProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
  completionStatus: Record<TabId, 'complete' | 'partial' | 'pending'>
}

const tabs: TabConfig[] = [
  {
    id: 'general',
    name: 'General',
    icon: ClipboardDocumentListIcon,
    description: 'Información básica del proyecto'
  },
  {
    id: 'variables',
    name: 'Variables',
    icon: WrenchScrewdriverIcon,
    description: 'Variables del sistema MIC MAC'
  },
  {
    id: 'experts',
    name: 'Expertos',
    icon: UsersIcon,
    description: 'Selección de expertos'
  },
  {
    id: 'scheduling',
    name: 'Programación',
    icon: CalendarIcon,
    description: 'Calendario y fechas'
  }
]

const getStatusIcon = (status: 'complete' | 'partial' | 'pending') => {
  switch (status) {
    case 'complete':
      return '✅'
    case 'partial':
      return '⚠️'
    case 'pending':
      return '❌'
    default:
      return '❌'
  }
}

const getStatusColor = (status: 'complete' | 'partial' | 'pending', isActive: boolean) => {
  if (isActive) {
    return 'border-blue-500 bg-blue-500 text-white'
  }
  
  switch (status) {
    case 'complete':
      return 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30'
    case 'partial':
      return 'border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-900/30'
    case 'pending':
      return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
    default:
      return 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
  }
}

export default function TabsNavigation({ 
  activeTab, 
  onTabChange, 
  completionStatus 
}: TabsNavigationProps) {
  return (
    <div className="w-full">
      <Tab.Group selectedIndex={tabs.findIndex(tab => tab.id === activeTab)} onChange={(index) => onTabChange(tabs[index].id)}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const status = completionStatus[tab.id]
            const IconComponent = tab.icon
            
            return (
              <Tab
                key={tab.id}
                className={({ selected }) => `
                  w-full rounded-lg py-3 px-4 text-sm font-medium leading-5 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-400
                  ${selected 
                    ? 'bg-white text-blue-700 shadow border-2 border-blue-500 dark:bg-gray-700 dark:text-blue-300' 
                    : `border-2 ${getStatusColor(status, false)}`
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs">{getStatusIcon(status)}</span>
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:block">{tab.name}</span>
                  {tab.id === 'variables' && (
                    <span className="hidden sm:block text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                      ⭐
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {tab.description}
                </div>
              </Tab>
            )
          })}
        </Tab.List>
      </Tab.Group>
    </div>
  )
}

