'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DynamicTableBuilderProps {
  onTableCreate?: (rows: number, cols: number) => void
}

export function DynamicTableBuilder({ onTableCreate }: DynamicTableBuilderProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [selectedRows, setSelectedRows] = useState(0)
  const [selectedCols, setSelectedCols] = useState(0)
  const [tableData, setTableData] = useState<string[][]>([])
  const [isHovering, setIsHovering] = useState(false)

  const maxRows = 10
  const maxCols = 4

  const handleCellHover = (row: number, col: number) => {
    setSelectedRows(row + 1)
    setSelectedCols(col + 1)
  }

  const handleCreateTable = () => {
    if (selectedRows > 0 && selectedCols > 0) {
      const newTable = Array.from({ length: selectedRows }, () =>
        Array(selectedCols).fill('')
      )
      setTableData(newTable)
      setShowSelector(false)
      setSelectedRows(0)
      setSelectedCols(0)
      onTableCreate?.(selectedRows, selectedCols)
    }
  }

  const handleRemoveTable = () => {
    setTableData([])
    setSelectedRows(0)
    setSelectedCols(0)
  }

  const handleRemoveRow = (rowIndex: number) => {
    setTableData((prev) => prev.filter((_, i) => i !== rowIndex))
  }

  const handleAddRow = () => {
    if (tableData.length > 0) {
      setTableData((prev) => [...prev, Array(prev[0].length).fill('')])
    }
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    setTableData((prev) => {
      const newData = [...prev]
      newData[rowIndex][colIndex] = value
      return newData
    })
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-normal text-black">Table (Optional)</label>
        {tableData.length > 0 && (
          <button
            onClick={handleRemoveTable}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
          >
            <Minus className="h-4 w-4 rounded-full border border-gray-400" />
            Remove Table
          </button>
        )}
      </div>

      {tableData.length === 0 ? (
        <div>
          <Button
            variant="outline"
            size="sm"
            className="mb-3 gap-1 border-gray-300 text-black hover:bg-gray-50"
            onClick={() => setShowSelector(!showSelector)}
          >
            <Plus className="h-4 w-4" />
            Add Table
          </Button>

          {showSelector && (
            <div className="inline-block rounded border border-gray-300 bg-white p-4">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${maxCols}, 40px)`,
                }}
                onMouseLeave={() => {
                  setIsHovering(false)
                  setSelectedRows(0)
                  setSelectedCols(0)
                }}
              >
                {Array.from({ length: maxRows * maxCols }).map((_, index) => {
                  const row = Math.floor(index / maxCols)
                  const col = index % maxCols
                  const isSelected = row < selectedRows && col < selectedCols

                  return (
                    <div
                      key={index}
                      className={cn(
                        'h-10 w-10 cursor-pointer rounded border transition-colors',
                        isSelected
                          ? 'border-gray-400 bg-gray-300'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-200'
                      )}
                      onMouseEnter={() => handleCellHover(row, col)}
                      onClick={handleCreateTable}
                    />
                  )
                })}
              </div>
              <div className="mt-2 text-center text-sm text-gray-600">
                {selectedRows} x {selectedCols}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {tableData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
                {row.map((cell, colIndex) => (
                  <input
                    key={colIndex}
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    placeholder="Please enter..."
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                  />
                ))}
              </div>
              <button
                onClick={() => handleRemoveRow(rowIndex)}
                className="flex items-center justify-center"
              >
                <Minus className="h-5 w-5 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 text-sm text-gray-900 hover:text-black"
          >
            <Plus className="h-5 w-5 rounded-full border border-gray-400" />
            Add Row
          </button>
        </div>
      )}
    </div>
  )
}
