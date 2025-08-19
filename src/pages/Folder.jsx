import React from 'react';
import './Folder.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, NativeSelect, Tabs, SegmentedControl } from '@mantine/core';
import { 
  IconSearch, 
  IconFolderFilled, 
  IconRefresh
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import { baseUrl } from '../shared';


export default function Folder() {   
    const { folder_id } = useParams();
    const [folderItems, setFolderItems] = useState([]); 
    
    const getFolderItems = async () => {
        try {
            const response = await fetch(baseUrl + `api/libraries/${folder_id}/`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setFolderItems(data || []);
            }


        } catch (error) {
            console.error("Error getting folder items. ", error);
        }
    }

    useEffect(() => {
        if (folder_id) {
            getFolderItems();
        }
    }, [folder_id]);

    return (
        <div className="folder-container">
            <div className="folder-items">
                <TableComponent showActions={true} showExport={true} showKeyword={true} showFooterText={false} showLibrary={false} searchType={"folder"} searchResults={folderItems} getFolderItems={getFolderItems} />
            </div>
        </div>
    );
}