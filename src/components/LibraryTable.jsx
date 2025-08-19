import './LibraryTable.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Popover, TextInput, Button, Table, Checkbox, ActionIcon, Badge, Group, Text, Menu, NativeSelect } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
    IconPlus, 
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { baseUrl } from '../shared';

export default function TableComponent(props) {
    const [starredRecords, setStarredRecords] = useState({});
    const [page, setPage] = useState(1);
    const [addFolderModalOpened, {open, close}] = useDisclosure(false);
    const [folderName, setFolderName] = useState('');  
    const [tableData, setTableData] = useState(props.fetchedData || []);
    const [filteredTableData, setFilteredTableData] = useState(tableData);
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        setTableData(props?.fetchedData || []);
    }, [props?.fetchedData]);

    const toggleStar = (id) => {
        setTableData(prev => prev.map(item => 
            item.id === id ? { ...item, starred: !item.starred } : item
        ));
    };

    useEffect(() => {
        const starredObj = {}; 
        tableData.map((item) => {
            return starredObj[item.id] = false; 
        });
        setStarredRecords(starredObj);
    }, [tableData])

    const columns = [
        {
            accessor: 'name', 
            title: 'Name',
            render: ({name}) => (
                <div className="name-column">
                    <IconFolderFilled size="1rem" />
                    <span className="name-text table-text">{name}</span>
                </div>
            ),
            width: 200,
        }, 
        {
            accessor: 'data', 
            title: 'Data', 
            render: ({data}) => (
                <div className="data-column">
                    <span className="data-text table-text">{data}</span>
                </div>
            ), 
            width: 100, 
        }, 
        {
            accessor: 'last_modified', 
            title: 'Last Modified', 
            render: ({last_modified}) => (
                <div className="last-modified-column">
                    <span className="last-modified-text table-text">{last_modified?.split("T")[0]}</span>
                </div>
            ), 
            width: 120, 
        }, 
        {
            accessor: 'memo', 
            title: 'Memo', 
            render: ({memo}) => (
                <div className="memo-column">
                    <span className="memo-text table-text">{memo}</span>
                </div>
            ), 
            width: 200,
        },
        {
            accessor: 'actions',
            title: '',
            render: ({ id }) => (
                <div className="column">
                    <Menu>
                        <Menu.Target>
                            <ActionIcon variant="subtle" size="sm">
                                <IconDotsVertical size={16} style={{color: '#000'}} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>Edit</Menu.Item>
                            <Menu.Item>Delete</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            ),
            width: 80
        }
    ]

    const addFolderHandler = async () => {
        try {
            const response = await fetch(baseUrl + `api/libraries/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }, 
                body: JSON.stringify({
                    name: folderName, 
                })
            });

            const data = await response.json(); 

            if (response.ok) {
                alert("Folder Created Successfully");
                props.getFolders(); // Refresh the folders list
                close();
            }
        } catch (error) {
            console.error("Error adding folder:", error);
        }
    }

    useEffect(() => {
        if (searchTerm) {
            setFilteredTableData(tableData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setFilteredTableData(tableData);
        }
    }, [tableData, searchTerm])


    return (
        <div className="library-table-component-container">
            <Modal opened={addFolderModalOpened} onClose={close} title={
                <div className="add-folder-modal-header">
                    <IconFolderFilled size="1.5rem" color="#000"/>
                    <span className="add-folder-modal-title">저장하기</span>
                </div>
            }>
                <div className="add-folder-modal-content">
                    <hr className="add-folder-modal-separator"/>
                    <div className="add-folder-modal-item">
                        <span className="add-folder-modal-item-label">폴더 형식</span>
                        <NativeSelect 
                            variant="filled"
                            placeholder="상위 5개"
                            data={["Product", "Video"]}
                        />
                    </div>
                    <div className="add-folder-modal-item">
                        <span className="add-folder-modal-item-label">폴더 이름</span>
                        <TextInput 
                            variant="filled"
                            placeholder="폴더 이름을 입력하세요"
                            className="add-folder-modal-input"
                            onChange={(e) => setFolderName(e.target.value)}
                        />
                    </div>
                    <Button variant="filled" color="rgba(0,0,0,1)" className="add-folder-modal-button" onClick={() => addFolderHandler()}>
                        저장
                    </Button>
                </div>
            </Modal>

            <div className="library-table-component-header">
                <div className="library-table-component-title">
                    {props.showActions &&
                        <div className="library-table-component-actions">
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
                    <div className="library-table-component-subtitle">
                        <span className="library-table-component-subtitle-text">네이버 쇼핑의 “장어 선물세트" 상위 검색결과</span>
                    </div>
                }
            </div>

            <div>
            <DataTable
                records={filteredTableData?.slice((page - 1) * pageSize, page * pageSize)}
                columns={columns}
                totalRecords={filteredTableData?.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                withTableBorder
                withColumnBorders={false}
                striped={false}
                highlightOnHover
                paginationActiveBackgroundColor="red"
                paginationColor="red"
                noRecordsIcon={null}
                noRecordsText={null}
                styles={{
                    header: {
                        fontWeight: 'bold', 
                        fontSize: '14px',
                    },
                    checkbox: {
                        '& input[type="checkbox"]': {
                            borderRadius: '6px', // Custom border radius
                            borderColor: '#3B82F6', // Custom border color
                        },
                        '& input[type="checkbox"]:checked': {
                            backgroundColor: 'red', // Custom checked background
                            borderColor: 'red',
                        }
                    },
                    root: {
                        '& tbody tr': {
                            cursor: 'pointer',
                        }
                    }
                }}
                paginationText={({ from, to, totalRecords }) => 
                    <div className="table-footer">
                        <Button
                            leftSection={<IconPlus size="1rem" />}
                            variant="filled"
                            color="rgba(1,1,1,1)"
                            className="table-footer-button"
                            onClick={open}
                        >폴더 만들기</Button>
                    </div>
                }
                recordsPerPageOptions={[5, 10, 20]}
                recordsPerPageLabel={`${pageSize} per page`}
                onRecordsPerPageChange={setPageSize}
                onRowClick={(record, recordIndex) => {
                    navigate(`/folder/${record?.record?.id}`);
                }}
            />
        </div>
        </div>
    ); 
}