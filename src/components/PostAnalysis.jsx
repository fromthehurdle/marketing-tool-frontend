import React from 'react';
import './PostAnalysis.css';
import { useState, useEffect } from 'react';
import { Checkbox, Image, Button, Input, NativeSelect, Tabs, SegmentedControl, TextInput, Menu, ActionIcon } from '@mantine/core';
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
import SidebarMenu from './SidebarMenu';
import { baseUrl } from '../shared';


export default function PostAnalysis(props) {
    const [activeTab, setActiveTab] = useState('detail-page'); // full, detail-page, ai
    const [analysisResult, setAnalysisResult] = useState([]);
    const [sectionButtons, setSectionButtons] = useState([]); 
    const [openSection, setOpenSection] = useState(null);   

    const getAnalysisResult = async () => {
        try {
            const response = await fetch(baseUrl + `api/analysis-results/by_result/?result_id=${props?.resultData?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`, 
                }
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data || []);
                setSectionButtons(data.reduce((acc, item, index) => {
                    acc[item.section] = false;
                    return acc;
                }, {}));
                setSectionButtons(prev => ({
                    ...prev,
                    "summary": true, // Always keep summary section open
                }))
            }

        } catch (error) {
            console.error("Error fetching analysis result:", error);
        }
    }
    useEffect(() => {
        getAnalysisResult();
    }, []);

    const getImageCategory = (category) => {
        switch (category) {
            case 'product_option':
                return 'Product Option';
            case 'product_description':
                return 'Product Description';
            case 'specifications':
                return 'Specifications';
            case 'usage_guide':
                return 'Usage Guide';
            case 'ingredients':
                return 'Ingredients';
            case 'size_chart':
                return 'Size Chart';
            case 'warranty':
                return 'Warranty';
            case 'other':
                return 'Other';
            default:
                return 'TBD';
        }
    }

    return (
        <div className="post-analysis-container">
            <div className="post-analysis-header">
                <Image src="" w={40} h={40} fallbackSrc="https://placehold.co/600x400?text=Placeholder"/>
                <div className="post-analysis-header-text">
                    <span className="post-analysis-header-title">{props?.resultData?.product}</span>
                    <span className="analysis-crawled-header-subtitle">Completed {props?.resultData?.created_at.split("T")[0]} {props?.resultData?.created_at.split("T")[1].split(".")[0]}</span>
                </div>
            </div>
            <hr style={{marginTop: "-16px"}} />
            <SegmentedControl
                value={activeTab}
                onChange={setActiveTab}
                data={[
                    {
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* <IconSettingsAutomation size="1.5rem" /> */}
                            <span style={{ fontSize: '16px', fontWeight: '500'}}>전체 보기</span>
                            </div>
                        ),
                        value: 'full'
                    },
                    {
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconChartBar size="1.5rem" />
                            <span style={{ fontSize: '16px', fontWeight: '500'}}>상세 페이지 분석하기</span>
                            </div>
                        ),
                        value: 'detail-page'
                    },
                    {
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconMessage size="1.5rem" />
                            <span style={{ fontSize: '16px', fontWeight: '500'}}>상세 페이지 분석하기</span>
                            </div>
                        ),
                        value: 'ai'
                    }
                ]}
            /> 
            <div className="post-analysis-result">
                <div className="result-sidebar">
                    <div className="manage-grouping">
                        <div className="manage-grouping-header">
                            <span className="manage-grouping-header-text">섹션 별 분석 결과</span>
                            <span className="manage-grouping-header-subtext">상세 분석 결과를 클릭해서 확인하세요</span>
                        </div>
                        <div className="grouping-item-container">
                            <div className={sectionButtons["summary"] ? "grouping-item selected-grouping-item" : "grouping-item"} onClick={() => {
                                setSectionButtons(prev => ({
                                    ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                                    "summary": true  // Always set to true, don't toggle
                                }));
                                setOpenSection("summary");
                            }}>
                                <div className="group-item-text">
                                    <div className="group-item-section">Summary</div>
                                    <span className="group-item-category">
                                        상세페이지 분석 요약 확인하기
                                    </span>
                                </div>
                            </div>
                            {analysisResult?.map((item, index) => {
                                return (
                                    <div key={index} className={sectionButtons[item.section] ? 'grouping-item selected-grouping-item' : 'grouping-item'} onClick={() => {
                                        setSectionButtons(prev => ({
                                            ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                                            [item.section]: true  // Always set to true, don't toggle
                                        }));

                                        setOpenSection(item?.section);
                                        
                                    }}>
                                        <div className="group-item-text">
                                            <div className="group-item-section">Section {item?.section}</div>
                                            <div className="group-item-category">
                                                <IconBookmarkFilled size="1.2rem" color={sectionButtons[item.section] ? "#fff" : "#000"} />
                                                <span>{getImageCategory(item?.category)}</span>
                                            </div>
                                        </div>
                                        {/* <IconDots size="1.2rem" color="#E5E5EC" className="grouping-item-menu" /> */}
                                        {/* <SidebarMenu /> */}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="result-main">
                    {/* <ResultSummary /> */}
                    <SectionResult analysisResult={analysisResult} getImageCategory={getImageCategory} openSection={openSection} setOpenSection={setOpenSection} sectionButtons={sectionButtons} setSectionButtons={setSectionButtons} />
                </div>
            </div>
        </div>
        
    );
}