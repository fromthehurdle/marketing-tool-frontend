import React from 'react';
import './SidebarMenu.css';
import { useState, useEffect } from 'react';
import { Checkbox, Image, Button, Input, NativeSelect, Tabs, SegmentedControl, TextInput, Menu, ActionIcon, ModalBaseCloseButton } from '@mantine/core';
import { 
  IconSearch, 
  IconFolderFilled, 
  IconRefresh, 
  IconFileAnalyticsFilled, 
  IconUpload,
  IconSettingsAutomation,
  IconChart,
  IconChartBar,
  IconMenu, 
  IconDotsCircleHorizontal, 
  IconDots, 
  IconBookmarkFilled,
  IconMessage, 
  IconDotsVertical,
  IconTrash, 
  IconSwitch, 
  IconCrop, 
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import CompareComponent from '../components/CompareComponent';
import ResultSummary from './ResultSummary';
import SectionResult from './SectionResult';


export default function SidebarMenu(props) {

    return (
        <Menu className="menu">
            <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                    <IconDots size={16} style={{color: '#E5E5EC'}} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className="menu-dropdown-container" style={{zIndex: 1001}}>
                <div className="menu-dropdown">
                    <div className="menu-dropdown-header">
                        <IconDots size="1.2rem" color="#000" />
                        <span className="menu-dropdown-header-text">메뉴</span>
                    </div>
                    <hr />
                    <Menu.Item className="menu-item" onClick={() => {
                        props?.handleImageDelete(props.cropId);
                    }}>
                        <IconTrash size="1.2rem" color="#000" />
                        <span className="menu-item-text">이미지 삭제하기</span>
                    </Menu.Item>
                    {/* <Menu.Item className="menu-item">
                        <IconSwitch size="1.2rem" color="#000" />
                        <span className="menu-item-text">이미지 교체하기</span>
                    </Menu.Item> */}
                    <Menu.Item className="menu-item" onClick={() => {
                        props.openCropModal();
                        props.setCropSection(props.section);
                        props.setCropId(props.cropId);
                        props?.setCropImageList([props?.cropId]);
                        props?.setHoveredItem(null);    
                    }}> 
                        <IconCrop size="1.2rem" color="#000" />
                        <span className="menu-item-text">이미지 크롭하기</span>
                    </Menu.Item>
                </div>
            </Menu.Dropdown>
        </Menu>
    );
}