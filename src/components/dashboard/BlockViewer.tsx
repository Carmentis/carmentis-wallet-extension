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
    Button,
    Paper,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    ChevronRight,
    KeyboardArrowDown,
    KeyboardArrowUp,
    KeyboardBackspace,
    CalendarToday,
    TextFields,
    Numbers,
    List,
    Code,
    MoreHoriz,
    Error as ErrorIcon
} from "@mui/icons-material";

/**
 * A component for viewing and navigating through JSON data.
 * 
 * @param {Object} props - Component props
 * @param {Record<string, any>} props.data - The JSON data to display
 * @param {string[]} props.initialPath - The initial path to navigate to in the data
 * @returns {JSX.Element} - The rendered component
 */
export function BlockViewer({data, initialPath}: {data: Record<string, any>, initialPath: string[]}) {
    const [path, setPath] = useState(initialPath);
    const [shownData, setShowData] = useState(data);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // compute the shown data
        let shownData = data;
        for (const token of path) {
            shownData = shownData[token];
        }
        setShowData(shownData);
        // Reset expanded items when path changes
        setExpandedItems({});
    }, [path, data]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    const toggleExpand = (key: string) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    function navigateToPath(key: string) {
        setPath(p => [...p, key]);
    }

    function backPath() {
        if (path.length > 0) {
            const newPath = [...path];
            newPath.pop();
            setPath(newPath);
        }
    }

    function getDataTypeIcon(value: any) {
        if (typeof value === 'string') return <TextFields fontSize="small" className="text-blue-500" />;
        if (typeof value === 'number') return <Numbers fontSize="small" className="text-green-500" />;
        if (Array.isArray(value)) return <List fontSize="small" className="text-purple-500" />;
        if (value instanceof Date) return <CalendarToday fontSize="small" className="text-orange-500" />;
        if (typeof value === 'object' && value !== null) return <Code fontSize="small" className="text-indigo-500" />;
        return <ErrorIcon fontSize="small" className="text-red-500" />;
    }

    function getValuePreview(value: any) {
        if (value === null) return <span className="text-gray-400">null</span>;
        if (value === undefined) return <span className="text-gray-400">undefined</span>;

        if (typeof value === 'string') {
            return <span className="text-blue-600 font-mono">{value.length > 50 ? `${value.substring(0, 50)}...` : value}</span>;
        }

        if (typeof value === 'number') {
            return <span className="text-green-600 font-mono">{value}</span>;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-gray-400">[]</span>;
            if (value.every(v => typeof v === 'string')) {
                return <span className="text-purple-600 font-mono">[{value.slice(0, 3).join(', ')}{value.length > 3 ? `, ... +${value.length - 3} more` : ''}]</span>;
            }
            return <span className="text-purple-600 font-mono">[{value.length} items]</span>;
        }

        if (value instanceof Date) {
            return <span className="text-orange-600 font-mono">{value.toLocaleString()}</span>;
        }

        if (typeof value === 'object') {
            const keys = Object.keys(value);
            return <span className="text-indigo-600 font-mono">
                {`{${keys.slice(0, 2).join(', ')}${keys.length > 2 ? `, ... +${keys.length - 2} more` : ''}}`}
            </span>;
        }

        return <span className="text-gray-600">{String(value)}</span>;
    }

    function renderBreadcrumbs() {
        if (path.length === 0) return null;

        return (
            <motion.div 
                className="flex items-center flex-wrap mb-2 p-2 bg-gray-50 rounded-md overflow-x-auto"
                variants={itemVariants}
            >
                <span 
                    className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
                    onClick={() => setPath([])}
                >
                    <KeyboardBackspace fontSize="small" className="mr-1" />
                    root
                </span>

                {path.map((segment, index) => (
                    <React.Fragment key={index}>
                        <ChevronRight fontSize="small" className="mx-1 text-gray-400" />
                        <span 
                            className={`${index === path.length - 1 ? 'text-gray-700 font-medium' : 'text-blue-600 hover:text-blue-800 cursor-pointer'}`}
                            onClick={() => index < path.length - 1 ? setPath(path.slice(0, index + 1)) : null}
                        >
                            {segment}
                        </span>
                    </React.Fragment>
                ))}
            </motion.div>
        );
    }

    function renderExpandableValue(key: string, value: any, index: number) {
        const isExpanded = expandedItems[key] || false;
        const isObject = typeof value === 'object' && value !== null;
        const isArray = Array.isArray(value);
        const isExpandable = isObject || isArray;

        // to prevent null or undefined issues, we explicity format
        const safeValue =
            value === undefined ? 'undefined' :
            value === null ? 'null' :
                value;

        return (
            <motion.div 
                key={index}
                variants={itemVariants}
                className="border border-gray-100 rounded-md mb-2 overflow-hidden"
            >
                <div 
                    className={`flex items-center justify-between p-3 ${isExpandable ? 'cursor-pointer hover:bg-gray-50' : ''} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    onClick={isExpandable ? () => toggleExpand(key) : undefined}
                >
                    <div className="flex items-center space-x-2 overflow-hidden">
                        {getDataTypeIcon(value)}
                        <span className="font-medium text-gray-700 truncate">{key}</span>
                    </div>

                    <div className="flex items-center">
                        <div className="text-gray-600 mr-2 max-w-xs truncate">
                            {getValuePreview(value)}
                        </div>

                        {isExpandable ? (
                            isExpanded ? (
                                <KeyboardArrowUp fontSize="small" className="text-gray-500" />
                            ) : (
                                <KeyboardArrowDown fontSize="small" className="text-gray-500" />
                            )
                        ) : null}

                        {isObject && !isArray && !isExpanded && (
                            <Button 
                                size="small" 
                                variant="text" 
                                className="ml-2 text-blue-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToPath(key);
                                }}
                            >
                                Navigate
                            </Button>
                        )}
                    </div>
                </div>

                {isExpanded && isExpandable && (
                    <div className="p-3 border-t border-gray-100 bg-white">
                        {isArray ? (
                            <div className="space-y-2">
                                {value.slice(0, 10).map((item: any, i: number) => (
                                    <div key={i} className="flex items-start p-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-500 mr-2">{i}:</span>
                                        <div>{getValuePreview(item)}</div>
                                    </div>
                                ))}
                                {value.length > 10 && (
                                    <div className="text-center text-gray-500 p-2">
                                        + {value.length - 10} more items
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(safeValue).slice(0, 10).map(([subKey, subValue], i) => (
                                    <div key={i} className="flex items-start p-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-700 font-medium mr-2 min-w-[100px]">{subKey}:</span>
                                        <div>{getValuePreview(subValue)}</div>
                                    </div>
                                ))}
                                {Object.keys(safeValue).length > 10 && (
                                    <div className="text-center text-gray-500 p-2">
                                        + {Object.keys(safeValue).length - 10} more properties
                                    </div>
                                )}
                                <div className="text-center mt-2">
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        className="text-blue-600"
                                        onClick={() => navigateToPath(key)}
                                    >
                                        View Full Object
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        );
    }

    function renderEmptyState() {
        return (
            <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center justify-center p-8 text-center"
            >
                <MoreHoriz className="text-gray-400 text-5xl mb-4" />
                <Typography variant="h6" className="text-gray-700 mb-2">
                    Empty Object
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    This object doesn't contain any properties
                </Typography>
                {path.length > 0 && (
                    <Button 
                        variant="outlined" 
                        size="small"
                        className="mt-4"
                        startIcon={<KeyboardBackspace />}
                        onClick={backPath}
                    >
                        Go Back
                    </Button>
                )}
            </motion.div>
        );
    }

    let renderedShownData: any = <></>
    if (shownData !== null && shownData !== undefined) {
        if (Object.keys(shownData).length === 0) {
            renderedShownData = renderEmptyState()
        } else {
            renderedShownData = Object.entries(shownData).map(([key, value], index) =>
                renderExpandableValue(key, value, index)
            )
        }
    } else {
        renderedShownData = renderEmptyState()
    }

    return (
        <div className="w-full h-full overflow-auto">
            {renderBreadcrumbs()}

            <Paper elevation={0} className="border border-gray-100 rounded-lg overflow-hidden">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-3"
                >
                    {renderedShownData}
                </motion.div>
            </Paper>
        </div>
    );
}