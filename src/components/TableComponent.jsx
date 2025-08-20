import './TableComponent.css';
import React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Popover, TextInput, Button, Table, Checkbox, ActionIcon, Badge, Group, Text, Menu, NativeSelect } from '@mantine/core';
import { 
    IconFolderFilled, 
    IconCircleCheck,
    IconStar, 
    IconStarFilled, 
    IconExternalLink,
    IconDotsVertical, 
    IconSchema, 
    IconSearch, 
    IconFilter,
    IconDots, 
    IconTrash, 
    IconSwitch,
    IconCrop, 
    IconDiamond, 
    IconRotate, 
    IconBan, 
    IconCopy, 
    IconEyeCancel,
    IconEye, 
    IconPick, 
    IconChevronDown,
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { baseUrl } from '../shared';
import { useDisclosure } from '@mantine/hooks';
import ColumnMenu from './ColumnMenu';

export default function TableComponent(props) {
    const [selectedRows, setSelectedRows] = useState([]);   

    const [selectedRecords, setSelectedRecords] = useState([]);
    const [starredRecords, setStarredRecords] = useState({});
    const [page, setPage] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [uniqueKeywords, setUniqueKeywords] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState('');
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Add these states to your component
    const [hiddenRows, setHiddenRows] = useState(new Set());
    const [pinnedRows, setPinnedRows] = useState(new Set());
    const [expandedData, setExpandedData] = useState(false);
    const [textWrapped, setTextWrapped] = useState(false);

    const [pageSize, setPageSize] = useState(10); // Default page size
    // const PAGE_SIZE = 10;

    const [columnItems, setColumnItems] = useState({
        keyword: true,
        seller: true,
        product: true,
        original_price: true,
        sale_price: true,
        shipping: true,
        review_count: true,
        rating: true,
        library: true,
        date: true,
    });
    const [filteredColumns, setFilteredColumns] = useState([]);

    const [libraryModalOpened, { open: openLibraryModal, close: closeLibraryModal }] = useDisclosure(false);

    const navigate = useNavigate();

    const handleDataExpansion = (id) => {
        setExpandedData(!expandedData);
        // You can implement specific logic for expanding/contracting data display
        console.log(`Data expansion toggled for row ${id}`);
    };

    const handleTextWrap = (id) => {
        setTextWrapped(!textWrapped);
        // Toggle text wrapping for the entire table or specific row
        console.log(`Text wrap toggled for row ${id}`);
    };

    const handlePinRow = (id) => {
        setPinnedRows(prev => {
            const newPinned = new Set(prev);
            if (newPinned.has(id)) {
                newPinned.delete(id);
            } else {
                newPinned.add(id);
            }
            return newPinned;
        });
        console.log(`Row ${id} pin toggled`);
    };

    const handleHideRow = (id) => {
        setHiddenRows(prev => {
            const newHidden = new Set(prev);
            newHidden.add(id);
            return newHidden;
        });
        console.log(`Row ${id} hidden`);
    };

    const handleDuplicateRow = async (id) => {
        const rowToDuplicate = tableData.find(item => item.id === id);
        if (rowToDuplicate) {
            const duplicatedRow = {
                ...rowToDuplicate,
                id: Date.now(), // Generate new unique ID
                product: `${rowToDuplicate.product} (복사본)`
            };
            setTableData(prev => [...prev, duplicatedRow]);
            console.log(`Row ${id} duplicated`);

            try {
                const response = await fetch(baseUrl + `api/result-items/${id}/duplicate/`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }, 
                    body: JSON.stringify({

                    })
                }); 

            } catch (error) {
                console.error("Error duplicating row: ", error);
            }
        }
    };
    
    const handleDeleteRow = async (id) => {
        if (window.confirm('이 항목을 삭제하시겠습니까?')) {
            setTableData(prev => prev.filter(item => item.id !== id));
            console.log(`Row ${id} deleted`);

            // try {
            //     const response = await fetch(baseUrl + `api/libraries/${id}/`, {
            //         method: 'DELETE', 
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${localStorage.getItem('access')}`
            //         }, 
            //         body: JSON.stringify({
            //             result: id, 
            //         })
            //     }); 
            // } catch (error) {
            //     console.error("Error deleting row: ", error);
            // }
        }
    };


    useEffect(() => {
        if (props?.searchType === "folder") {
            setTableData(props?.searchResults?.items?.map((result, index) => {
                return {
                    ...result?.result?.result_items[0], 
                    keyword: props?.searchResults?.items?.[index]?.result?.search_keyword, 
                    library: props?.searchResults?.name
                };
            }));
        } else if (props.searchType === "history") {
            setTableData(props?.searchResults);
        } else {
            setTableData(props?.searchResults?.items?.map((result) => {
                return {...result, keyword: props?.searchResults?.search?.keyword, result_id: props?.searchResults?.id};
            }) || []);
        }        

    }, [props?.searchResults]);

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            // Extract unique keywords from tableData
            const keywords = [...new Set(tableData.map(item => item.keyword).filter(Boolean))];
            setUniqueKeywords(['All Keywords', ...keywords]); // Add "All Keywords" option
            setFilteredTableData(tableData); // Initialize filtered data
        }
    }, [tableData]);

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            // let filtered = tableData;

            // Hide hidden rows 
            let filtered = tableData.filter(item => !hiddenRows.has(item.id));

            // Sort pinned rows to the top
            filtered.sort((a, b) => {
                const aPinned = pinnedRows.has(a.id);
                const bPinned = pinnedRows.has(b.id);
                if (aPinned && !bPinned) return -1;
                if (!aPinned && bPinned) return 1;
                return 0;
            });

            // Filter by keyword
            if (selectedKeyword && selectedKeyword !== 'All Keywords') {
                filtered = filtered.filter(item => item.keyword === selectedKeyword);
            }

            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(item => 
                    item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.seller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.keyword?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredTableData(filtered);
        }
        
    }, [tableData, selectedKeyword, searchTerm, hiddenRows, pinnedRows]);


    useEffect(() => {
        const starredObj = {}; 
        tableData?.map((item) => {
            return starredObj[item.id] = false; 
        });
        setStarredRecords(starredObj);
    }, [tableData]);

    const handleStarToggle = async (id) => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${id}/toggle_star/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            }); 

            if (response.ok) {
                if (props?.searchType === "folder") {
                    props?.getFolderItems(); 
                } else if (props?.searchType === "history") {
                    props?.getHistory();
                }
            }
        } catch (error) {
            console.error("Error toggling star:", error);
        }
    }
    

    const columns = [
        ...(props.showKeyword ? [{
            accessor: 'keyword', 
            title: 'Keyword', 
            textAlign: 'left', 
            minWidth: 80, 
            render: ({keyword}) => (
                <div className="keyword-column">
                    <span className="keyword-text">{keyword}</span>
                </div>
            )
        }] : []),
        {
            accessor: 'seller',
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Seller" columnIdentifier="seller" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ),
            render: ({seller, id, starred}) => (
                <div className="seller-column" onClick={(e) => {
                }}>
                    {starred ? (
                        <IconStarFilled size={16} style={{ color: '#203DE0', cursor: 'pointer' }} onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(id);
                        }} />
                    ) : (
                        <IconStar size={16} style={{ color: '#000', cursor: 'pointer' }} onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(id);
                        }}/>
                    )}
                    <div className="seller-text">{seller}</div>
                </div>
            ), 
            minWidth: 100, 
        },
        {
            accessor: 'product', 
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Product" columnIdentifier="product" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ), 
            render: ({product, product_url}) => (
                <div className="product-column-container">
                    <div className="product-column">
                        <span className="product-text">{product}</span>
                    </div>
                    <IconExternalLink size={14} style={{ color: '#2451F8', flexShrink: 0, cursor: 'pointer' }}  onClick={() => {
                        window.open(product_url, '_blank');
                    }}/>
                </div>
            ), 
            width: 120, 
        }, 
        {
            accessor: 'original_price',
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Original Price" columnIdentifier="original_price" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ),
            render: ({original_price}) => (
                <div>
                    <span>
                        {new Intl.NumberFormat('ko-KR', {
                            style: 'currency',
                            currency: 'KRW'
                        }).format(original_price)}
                    </span>
                </div>
            ),
            width: 120,
        },
        {
            accessor: 'sale_price',
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Sale Price" columnIdentifier="sale_price" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ),
            render: ({sale_price, discount_percentage}) => (
                <div className="sale-price-column">
                    <span className="sale-price-text">
                        {new Intl.NumberFormat('ko-KR', {
                            style: 'currency',
                            currency: 'KRW'
                        }).format(sale_price)}
                    </span>
                    <span className="discount-text">{discount_percentage}%</span>
                </div>
            ),
            width: 140,
        },
        {
            accessor: 'shipping', 
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Shipping" columnIdentifier="shipping" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ),
            textAlign: 'left', 
            render: ({shipping}) => (
                <div className="shipping-column">
                    <span className="shipping-text">
                        {new Intl.NumberFormat('ko-KR', {
                            style: 'currency',
                            currency: 'KRW'
                        }).format(shipping)}
                    </span>
                </div>
            ),
            width: 80, 
        }, 
        {
            accessor: 'review_count',
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Review" columnIdentifier="review_count" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ),
            textAlign: 'center',
            width: 80
        },
        {
            accessor: 'rating',
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Rating" columnIdentifier="rating" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ),
            textAlign: 'center',
            render: ({rating}) => (
                <div className="rating-column">
                    <span className="rating-text">{rating}</span>
                </div>
            ),
            width: 70
        },
        {
            accessor: 'library', 
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Library" columnIdentifier="library" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ), 
            render: ({library}) => (
                <div className="column">
                    <span className="library-text">{library}</span>
                </div>
            ),
            width: 70, 
        }, {
            accessor: 'date',
            // title: 'Date',
            title: (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <ColumnMenu columnName="Date" columnIdentifier="date" columnItems={columnItems} setColumnItems={setColumnItems} />
                </div>
            ), 
            render: ({ date }) => (
                <div className="date-column">
                    {/* <span className="date-text">{date.split(",")[0]}</span>
                    <span className="date-text">{date.split(",")[1]}</span> */}
                </div>
            ),
            width: 50
        }, 
        {
            accessor: 'actions',
            title: '',
            render: ({ id, keyword }) => (
                <div className="column" onClick={(e) => e.stopPropagation()}>
                    <Menu className="menu">
                        <Menu.Target>
                            <ActionIcon 
                                variant="subtle" 
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <IconDots size={16} style={{color: '#E5E5EC'}} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown className="menu-dropdown-container">
                            <div className="menu-dropdown">
                                <div className="menu-dropdown-header">
                                    <span className="menu-dropdown-header-text">{keyword}</span>
                                </div>
                                <hr />
                                <Menu.Item 
                                    className="menu-item" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePinRow(id);
                                    }}
                                >
                                    <IconPick size="1.2rem" color="#000" />
                                    <span className="menu-item-text">고정하기</span>
                                </Menu.Item>
                                <Menu.Item 
                                    className="menu-item" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateRow(id); 
                                    }}
                                >
                                    <IconCopy size="1.2rem" color="#000" />
                                    <span className="menu-item-text">복제하기</span>
                                </Menu.Item>
                                <Menu.Item 
                                    className="menu-item" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteRow(id);
                                    }}
                                >
                                    <IconTrash size="1.2rem" color="#000" />
                                    <span className="menu-item-text">삭제하기</span>
                                </Menu.Item>
                            </div>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            ),
            width: 80
        }
    ]

    

    useEffect(() => {
        // Filter columns based on columnItems state
        setFilteredColumns(columns.filter(col => columnItems[col.accessor] !== false));
    }, [columnItems]);

    const exportButtonHandler = () => {
        console.log("Export button clicked");
        console.log("Table Records:", tableData);

        if (!tableData || tableData.length === 0) {
            alert("No data to export");
            return;
        }

        // Create HTML table format that Excel can read
        const headers = ['ID', 'Date', 'Product', 'Keyword', 'Seller', 'Seller Type', 'Original Price', 'Sale Price', 'Discount Percentage', 'Rating', 'Review Count', 'Shipping', 'Library', 'Starred'];
        
        let htmlContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <table>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        `;

        tableData.forEach(item => {
            htmlContent += `
                <tr>
                    <td>${item.id || ''}</td>
                    <td>${item.date || ''}</td>
                    <td>${item.product || ''}</td>
                    <td>${item.keyword || ''}</td>
                    <td>${item.seller || ''}</td>
                    <td>${item.sellerType || ''}</td>
                    <td>${item.original_price || ''}</td>
                    <td>${item.sale_price || ''}</td>
                    <td>${item.discount_percentage || ''}</td>
                    <td>${item.rating || ''}</td>
                    <td>${item.review_count || ''}</td>
                    <td>${item.shipping || ''}</td>
                    <td>${item.library || ''}</td>
                    <td>${item.starred || false}</td>
                </tr>
            `;
        });

        htmlContent += `
                </table>
            </body>
            </html>
        `;

        // Create blob and download as .xls file
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `table_data_${new Date().toISOString().slice(0, 10)}.xls`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log("Excel export completed");
        } else {
            alert("Export is not supported in this browser");
        }
    };

    const saveToLibraryButtonHandler = async () => {

        console.log("here: ", selectedRecords);
        try {
            const response = await fetch(baseUrl + 'api/libraries/1/add_item/', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + localStorage.getItem('access')
                }, 
                body: JSON.stringify({
                    result: selectedRecords.map(record => record.result_id)[0],  
                })
            });

            const data = await response.json(); 

            if (response.ok) {
                alert("Saved to library successfully");
            }
        } catch (error) {
            console.error("Error saving to library:", error);
        }
    }

    useEffect(() => {
        if (props.tableType === "search") {
            props.setSelectedRecords(selectedRecords);
        }
    }, [selectedRecords]);



    return (
        <div className="table-component-container">
            <Modal opened={libraryModalOpened}>
                
            </Modal>
            <div className="table-component-header">
                <div className="table-component-title">
                    <div className="table-component-icon-text">
                        <IconCircleCheck size="1rem" />
                        <span className="table-component-title-text">검색결과 (총 5건)</span>
                    </div>
                    {props.showActions &&
                        <div className="table-component-actions">
                            <NativeSelect 
                                leftSection={<IconSchema size="1rem" color="#000" />}
                                placeholder="Select Keyword"
                                data={uniqueKeywords.length > 0 ? uniqueKeywords : ['No keywords available']}
                                value={selectedKeyword}
                                onChange={(event) => {
                                    const keyword = event.currentTarget.value;
                                    setSelectedKeyword(keyword);
                                }}
                            />
                            <Popover width={300} position="bottom" withArrow shadow="md">
                                <Popover.Target>
                                    <IconFilter size="1rem" color="#000" style={{ cursor: 'pointer' }} />
                                </Popover.Target>                                
                                <Popover.Dropdown>
                                    <div>Filter options...</div>
                                </Popover.Dropdown>
                            </Popover>
                            <TextInput 
                                leftSection={<IconSearch size="1rem" color="#8A8A8A" />}
                                placeholder="검색" 
                                variant="filled"
                                className="search-input"
                                radius="4px"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                            />
                        </div>
                    }
                </div>
                {props.showSubtitle &&
                    <div className="table-component-subtitle">
                        <span className="table-component-subtitle-text">네이버 쇼핑의 “장어 선물세트" 상위 검색결과</span>
                    </div>
                }
            </div>

            <div>
            <DataTable
                // records={filteredTableData?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
                records={filteredTableData?.slice((page - 1) * pageSize, page * pageSize)}
                // columns={columns}
                columns={filteredColumns}
                selectedRecords={props.showRecords ? selectedRecords : undefined}
                onSelectedRecordsChange={props.showRecords ? setSelectedRecords : undefined}                
                totalRecords={filteredTableData?.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                withTableBorder
                withColumnBorders={false}
                striped={false}
                highlightOnHover
                // verticalSpacing="sm"
                // horizontalSpacing="md"
                // fontSize="sm"
                paginationActiveBackgroundColor="red"
                paginationColor="red"
                noRecordsIcon={null}
                noRecordsText={null}
                styles={{
                    header: {
                        fontWeight: 'bold', 
                        fontSize: '14px',
                    },
                    // pagination: {
                    //     justifyContent: 'space-between',
                    //     alignItems: 'center'
                    // },
                    checkbox: {
                        header: {
                            cursor: 'pointer',
                        },
                        '& input[type="checkbox"]': {
                            borderRadius: '6px', // Custom border radius
                            borderColor: '#3B82F6', // Custom border color
                        },
                        '& input[type="checkbox"]:checked': {
                            backgroundColor: 'red', // Custom checked background
                            borderColor: 'red',
                        }
                    }
                }}
                paginationText={({ from, to, totalRecords }) => 
                    <div className="table-footer">
                        {props.showFooterText &&
                            <span className="table-footer-text">
                                총 {totalRecords}건
                            </span>
                        }
                        {props.showExport && 
                            <Button
                                variant="filled"
                                color="rgba(1,1,1,1)"
                                className="table-footer-button"
                                onClick={() => exportButtonHandler()}
                            >Export</Button>
                        }
                        {props.showLibrary && 
                            <Button
                                leftSection={<IconFolderFilled size="1rem" />}
                                variant="filled"
                                color="rgba(1,1,1,1)"
                                className="table-footer-button"
                                // onClick={() => saveToLibraryButtonHandler()}
                                onClick={props.openLibraryModal}
                            >라이브러리 폴더에 저장</Button>
                        }
                    </div>
                }
                recordsPerPageOptions={[5, 10, 20]}
                recordsPerPageLabel={`${pageSize} per page`}
                onRecordsPerPageChange={setPageSize}
                onRowClick={(record) => {
                    navigate(`/analysis/${record?.record?.id}`);
                }}
            />
        </div>
        </div>
    ); 
}