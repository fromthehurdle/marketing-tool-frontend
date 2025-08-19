import React from 'react';
import './Library.css';
import { useState, useEffect } from 'react';
import { Button, Input, NativeSelect, Tabs, SegmentedControl } from '@mantine/core';
import { 
  IconSearch, 
  IconFolderFilled, 
  IconRefresh
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import LibraryTable from '../components/LibraryTable';
import { baseUrl } from '../shared';

export default function Library() {
    const [activeTab, setActiveTab] = useState('library');
    const [folders, setFolders] = useState([]);
    const [history, setHistory] = useState([]);

    const getFolders = async () => {
        try {
            const response = await fetch(baseUrl + `api/libraries/`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setFolders(data?.results || [])
            }

        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    }

    const getHistory = async () => {
        try {
            const response = await fetch(baseUrl + `api/result-items/`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setHistory(data?.results || [])
            }

        } catch (error) {
            console.error("Error fetching history:", error);
        }
    }

    useEffect(() => {
        getFolders();
        getHistory();
    }, []);

    return (
        <div className="library-container">
            <div className="top">
                <SegmentedControl
                    value={activeTab}
                    onChange={setActiveTab}
                    data={[
                        {
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <IconFolderFilled size="1rem" />
                                <span>라이브러리 폴더</span>
                                </div>
                            ),
                            value: 'library'
                        },
                        {
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <IconRefresh size="1rem" />
                                <span>기록</span>
                                </div>
                            ),
                            value: 'history'
                        }
                    ]}
                />
            </div>
            {activeTab === 'library' &&
                <div className="library-list">
                    <LibraryTable showActions={true} fetchedData={folders} getFolders={getFolders} />
                </div>
            }
            {activeTab === 'history' && 
                <div className="history-list">
                    <TableComponent showRecords={true} showActions={true} showExport={true} showKeyword={true} searchResults={history} searchType={"history"} getHistory={getHistory} />
                </div>
            }

        </div>
    ); 
}
