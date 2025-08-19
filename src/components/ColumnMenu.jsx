import './ColumnMenu.css';
import { Modal, Popover, TextInput, Button, Table, Checkbox, ActionIcon, Badge, Group, Text, Menu, NativeSelect } from '@mantine/core';
import { 
    IconDiamond, 
    IconRotate, 
    IconEyeCancel,
} from '@tabler/icons-react';


export default function ColumnMenu(props) {

    const handleColumn = (columnIdentifier) => {
        props?.setColumnItems({...props?.columnItems, [columnIdentifier]: !props?.columnItems[columnIdentifier]});
    }

    return (
        <Menu className="menu">
            <Menu.Target>
                <span>{props.columnName}</span>
            </Menu.Target>
            <Menu.Dropdown className="menu-dropdown-container">
                <div className="menu-dropdown">
                    <div className="menu-dropdown-header">
                        <span className="menu-dropdown-header-text">{props.columnName}</span>
                    </div>
                    <hr />
                    <Menu.Item 
                        className="menu-item"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <IconDiamond size="1.2rem" color="#000" />
                        <span className="menu-item-text">데이터 축소/확장하기</span>
                    </Menu.Item>
                    <Menu.Item 
                        className="menu-item"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IconRotate size="1.2rem" color="#000" />
                        <span className="menu-item-text">텍스트 줄바꿈</span>
                    </Menu.Item>
                    <Menu.Item 
                        className="menu-item" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleColumn(props.columnIdentifier);
                        }}
                    >
                        <IconEyeCancel size="1.2rem" color="#000" />
                        <span className="menu-item-text">숨기기</span>
                    </Menu.Item>
                </div>
            </Menu.Dropdown>
        </Menu>
    )
}