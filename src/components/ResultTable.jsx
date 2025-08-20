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
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(10);

    const [searchTerm, setSearchTerm] = useState('');

    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setColumns(props?.columns?.map((col) => ({
            accessor: col,
            title: col,
            width: 50,
        })))
    }, [props?.columns]);

    useEffect(() => {
        if (columns.length > 0 && props?.resultData?.length > 0) {
            setTableData(props?.resultData?.map((item) => {
                const record = {}; 
                columns.forEach((col, index) => {
                    record[col.accessor] = item[index];
                })
                return record;
            }));
        }
    }, [columns, props?.resultData]);

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
                records={tableData.slice((page - 1) * pageSize, page * pageSize)}
                columns={columns}
                totalRecords={tableData.length}
                recordsPerPage={pageSize}
                withTableBorder
                withColumnBorders={false}
                striped={false}
                highlightOnHover
                noRecordsIcon={null}
                noRecordsText={null}
                styles={{
                    header: {
                        fontWeight: 'bold', 
                        fontSize: '14px',
                    },
                    checkbox: {
                        '& input[type="checkbox"]': {
                            borderRadius: '6px',
                            borderColor: '#3B82F6',
                        },
                        '& input[type="checkbox"]:checked': {
                            backgroundColor: 'red',
                            borderColor: 'red',
                        }
                    },
                    root: {
                        '& tbody tr': {
                            cursor: 'pointer',
                        }
                    }
                }}
                recordsPerPageOptions={[5, 10, 20]}
                recordsPerPageLabel={`${pageSize} per page`}
                onRecordsPerPageChange={setPageSize}
            />
        </div>
        </div>
    ); 
}