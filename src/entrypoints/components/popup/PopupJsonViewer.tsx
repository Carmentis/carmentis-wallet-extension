/*
 * Copyright (c) Carmentis. All rights reserved.
 * Licensed under the Apache 2.0 licence.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Collapse,
  Tooltip
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowRight,
  KeyboardBackspace,
  TextFields,
  Numbers,
  List,
  Code,
  CalendarToday,
  MoreHoriz,
  Error as ErrorIcon
} from "@mui/icons-material";

/**
 * A compact JSON viewer specifically designed for popup interfaces with limited space.
 * 
 * @param {Object} props - Component props
 * @param {Record<string, any>} props.data - The JSON data to display
 * @param {string[]} props.initialPath - The initial path to navigate to in the data
 * @returns {JSX.Element} - The rendered component
 */
export function PopupJsonViewer({ data, initialPath = [] }: { data: Record<string, any>, initialPath?: string[] }) {
  const [path, setPath] = useState(initialPath);
  const [shownData, setShownData] = useState(data);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Update shown data when path changes
  useEffect(() => {
    let currentData = data;
    for (const segment of path) {
      currentData = currentData[segment];
    }
    setShownData(currentData);
    setExpandedItems({});
  }, [path, data]);

  // Toggle expanded state for an item
  const toggleExpand = (key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Navigate to a nested object
  const navigateToPath = (key: string) => {
    setPath(p => [...p, key]);
  };

  // Go back to the parent object
  const goBack = () => {
    if (path.length > 0) {
      setPath(p => p.slice(0, -1));
    }
  };

  // Get an icon based on the data type
  const getTypeIcon = (value: any) => {
    if (typeof value === 'string') return <TextFields fontSize="small" className="text-blue-500" />;
    if (typeof value === 'number') return <Numbers fontSize="small" className="text-green-500" />;
    if (Array.isArray(value)) return <List fontSize="small" className="text-purple-500" />;
    if (value instanceof Date) return <CalendarToday fontSize="small" className="text-orange-500" />;
    if (typeof value === 'object' && value !== null) return <Code fontSize="small" className="text-indigo-500" />;
    return <ErrorIcon fontSize="small" className="text-red-500" />;
  };

  // Format a value for display
  const formatValue = (value: any) => {
    if (value === null) return <span className="text-gray-400">null</span>;
    if (value === undefined) return <span className="text-gray-400">undefined</span>;

    if (typeof value === 'string') {
      return <span className="text-blue-600 font-mono">{value.length > 30 ? `${value.substring(0, 30)}...` : value}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-green-600 font-mono">{value}</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400">[]</span>;
      return <span className="text-purple-600 font-mono">[{value.length} items]</span>;
    }

    if (value instanceof Date) {
      return <span className="text-orange-600 font-mono">{value.toLocaleString()}</span>;
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      return <span className="text-indigo-600 font-mono">{`{${keys.length} properties}`}</span>;
    }

    return <span className="text-gray-600">{String(value)}</span>;
  };

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    if (path.length === 0) return null;

    return (
      <Box className="flex items-center flex-wrap mb-2 p-1.5 bg-gray-50 rounded-md overflow-x-auto text-xs">
        <span 
          className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
          onClick={() => setPath([])}
        >
          root
        </span>

        {path.map((segment, index) => (
          <React.Fragment key={index}>
            <KeyboardArrowRight fontSize="small" className="mx-0.5 text-gray-400" />
            <span 
              className={`${index === path.length - 1 ? 'text-gray-700 font-medium' : 'text-blue-600 hover:text-blue-800 cursor-pointer'}`}
              onClick={() => index < path.length - 1 ? setPath(path.slice(0, index + 1)) : null}
            >
              {segment}
            </span>
          </React.Fragment>
        ))}
      </Box>
    );
  };

  // Render a JSON property
  const renderProperty = (key: string, value: any, index: number) => {
    const isExpanded = expandedItems[key] || false;
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);
    const isExpandable = isObject || isArray;

    return (
      <Box 
        key={index}
        className={`border border-gray-100 rounded-md mb-1.5 overflow-hidden ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
      >
        <Box 
          className={`flex items-center justify-between p-2 ${isExpandable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
          onClick={isExpandable ? () => toggleExpand(key) : undefined}
        >
          <Box className="flex items-center space-x-1.5 overflow-hidden">
            {getTypeIcon(value)}
            <Typography className="font-medium text-gray-700 truncate text-sm">
              {key}
            </Typography>
          </Box>

          <Box className="flex items-center">
            <Box className="text-gray-600 mr-1.5 max-w-[120px] truncate text-xs">
              {formatValue(value)}
            </Box>

            {isExpandable && (
              isExpanded ? (
                <KeyboardArrowUp fontSize="small" className="text-gray-500" />
              ) : (
                <KeyboardArrowDown fontSize="small" className="text-gray-500" />
              )
            )}

            {isObject && !isArray && !isExpanded && (
              <IconButton 
                size="small" 
                className="ml-0.5 text-blue-600 p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToPath(key);
                }}
              >
                <KeyboardArrowRight fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Box className="p-2 border-t border-gray-100 bg-white">
            {isArray ? (
              <Box className="space-y-1">
                {value.slice(0, 5).map((item: any, i: number) => (
                  <Box key={i} className="flex items-start p-1.5 border-b border-gray-100 last:border-0 text-xs">
                    <span className="text-gray-500 mr-1.5">{i}:</span>
                    <Box>{formatValue(item)}</Box>
                  </Box>
                ))}
                {value.length > 5 && (
                  <Box className="text-center text-gray-500 p-1 text-xs">
                    + {value.length - 5} more items
                  </Box>
                )}
              </Box>
            ) : (
              <Box className="space-y-1">
                {Object.entries(value).slice(0, 5).map(([subKey, subValue], i) => (
                  <Box key={i} className="flex items-start p-1.5 border-b border-gray-100 last:border-0 text-xs">
                    <span className="text-gray-700 font-medium mr-1.5 min-w-[80px] truncate">{subKey}:</span>
                    <Box className="truncate">{formatValue(subValue)}</Box>
                  </Box>
                ))}
                {Object.keys(value).length > 5 && (
                  <Box className="text-center text-gray-500 p-1 text-xs">
                    + {Object.keys(value).length - 5} more properties
                  </Box>
                )}
                <Box className="text-center mt-1">
                  <Button 
                    size="small" 
                    variant="text" 
                    className="text-blue-600 text-xs py-0.5 px-2"
                    onClick={() => navigateToPath(key)}
                  >
                    View All
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <Box className="flex flex-col items-center justify-center p-4 text-center">
        <MoreHoriz className="text-gray-400 text-3xl mb-2" />
        <Typography variant="body2" className="text-gray-700 mb-1 font-medium">
          Empty Object
        </Typography>
        <Typography variant="caption" className="text-gray-500">
          No properties to display
        </Typography>
        {path.length > 0 && (
          <Button 
            variant="text" 
            size="small"
            className="mt-2 text-xs"
            startIcon={<KeyboardBackspace fontSize="small" />}
            onClick={goBack}
          >
            Back
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box className="w-full overflow-auto max-h-[300px]">
      {renderBreadcrumbs()}

      <Paper elevation={0} className="border border-gray-100 rounded-md overflow-hidden">
        <Box className="p-2">
          {Object.keys(shownData).length === 0 ? (
            renderEmptyState()
          ) : (
            Object.entries(shownData).map(([key, value], index) => 
              renderProperty(key, value, index)
            )
          )}
        </Box>
      </Paper>

      {path.length > 0 && (
        <Button
          variant="text"
          size="small"
          startIcon={<KeyboardBackspace />}
          onClick={goBack}
          className="mt-2 text-xs"
        >
          Back to Parent
        </Button>
      )}
    </Box>
  );
}