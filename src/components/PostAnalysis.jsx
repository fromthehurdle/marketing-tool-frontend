import React from 'react';
import './PostAnalysis.css';
import { useState, useEffect, useRef } from 'react';
import { Button, Image, SegmentedControl } from '@mantine/core';
import { 
  IconChartBar,
  IconMessage, 
  IconStack,
  IconX
} from '@tabler/icons-react';
import SectionResult from './SectionResult';
import { baseUrl } from '../shared';
import ResultSummary from './ResultSummary';

export default function PostAnalysis(props) {
    const [activeTab, setActiveTab] = useState('detail-page'); // full, detail-page, ai
    const [analysisResult, setAnalysisResult] = useState([]);
    const [sectionButtons, setSectionButtons] = useState([]); 
    const [sectionButtonsDict, setSectionButtonsDict] = useState({});
    const [openSection, setOpenSection] = useState(null);   
    const [openSubSection, setOpenSubsection] = useState(null); 

    const [sectionNavigatorVisible, setSectionNavigatorVisible] = useState(false);


    const [position, setPosition] = useState({ x: 1000, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const manageGroupingRef = useRef(null);

    const [sectionIndex, setSectionIndex] = useState(-1);
    const [subSectionIndex, setSubsectionIndex] = useState(1);
    let lastSection = -1; 
    let subIndex = 1; 

    // Add these event handlers
    const handleMouseDown = (e) => {
        // Only start dragging if clicking on the header area, not on interactive elements
        if (e.target.closest('input, button, select, textarea')) {
            return;
        }
        
        setIsDragging(true);
        const rect = manageGroupingRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        e.preventDefault(); // Prevent text selection
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        // Keep the element within viewport bounds
        const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));
        
        setPosition({
            x: newX,
            y: newY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add this useEffect
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset.x, dragOffset.y]);
    
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
            case 'hook':
                return 'Hook';
            case 'promotion':
                return 'Promotion';
            case 'selling_point':
                return 'Selling Point';
            case 'product_option':
                return 'Product Option';
            case 'product_information':
                return 'Product Information';
            case 'review': 
                return 'Review';
            case 'qna': 
                return 'QnA';
            case 'shipping': 
                return 'Shipping';            
            case 'other':
                return 'Other';
            default:
                return 'TBD';
        }
    }

    return (
        <div className="post-analysis-container">
            <div className="post-analysis-header">
                <div className="left">
                    <Image src="" w={40} h={40} fallbackSrc="https://placehold.co/600x400?text=Placeholder"/>
                    <div className="post-analysis-header-text">
                        <span className="post-analysis-header-title">{props?.resultData?.product}</span>
                        <span className="analysis-crawled-header-subtitle">Completed {props?.resultData?.created_at.split("T")[0]} {props?.resultData?.created_at.split("T")[1].split(".")[0]}</span>
                    </div>
                </div>
                <div className="right">
                    <div className="analysis-crawled-header-action">
                        <Button
                            leftSection={<IconStack size="1.5rem" />}
                            variant="filled"
                            color="rgba(0,0,0,1)"
                            className="analysis-crawled-header-button"
                            onClick={() => {
                                setSectionNavigatorVisible(!sectionNavigatorVisible);
                            }}
                        >
                            <span className="analysis-crawled-header-button-text">Section Navigator</span>
                        </Button>
                    </div>
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
                    {sectionNavigatorVisible && 
                        <div 
                            className="manage-grouping"
                            ref={manageGroupingRef}
                            style={{
                                position: 'absolute', 
                                left: `${position.x}px`, 
                                top: `${position.y}px`,
                                userSelect: 'none', 
                                zIndex: isDragging ? 1000 : 999,
                            }}
                        >
                            <div 
                                className="manage-grouping-header"
                                style={{
                                    cursor: isDragging ? 'grabbing' : 'move', 
                                    zIndex: 1000, 
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                <span className="manage-grouping-header-text">
                                    <span>섹션 별 분석 결과</span>
                                    <IconX size="1rem" onClick={() => {
                                        setSectionNavigatorVisible(false);
                                    }} style={{cursor: 'pointer'}} />
                                </span>
                                <span className="manage-grouping-header-subtext">상세 분석 결과를 클릭해서 확인하세요</span>
                            </div>
                            <div className="grouping-item-container">
                                {/* <div className={sectionButtons["summary"] ? "grouping-item selected-grouping-item" : "grouping-item"} onClick={() => { */}
                                <div className={sectionButtonsDict["summary"] ? "grouping-item selected-grouping-item" : "grouping-item"} onClick={() => {
                                    setSectionButtonsDict(prev => ({
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
                                    // let lastSection = -1; 
                                    // let subIndex = 1; 
                                    if (item?.section !== lastSection) {
                                        lastSection = item?.section;
                                        subIndex = 1; 
                                    } else {
                                        subIndex ++; 
                                    }

                                    const sidx = subIndex;


                                    return (
                                        <div key={index} className={sectionButtonsDict[`${item.section}-${sidx}`] ? 'grouping-item selected-grouping-item' : 'grouping-item'} onClick={() => {

                                            setSectionButtonsDict(prev => ({
                                                ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                                                [`${item.section}-${sidx}`]: true  // Always set to true, don't toggle
                                            }))
                                            // setSectionButtons(prev => ({
                                            //     ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                                            //     [item.section]: true  // Always set to true, don't toggle
                                            // }));

                                            setOpenSection(item?.section);
                                            setOpenSubsection(sidx);
                                            
                                        }}>
                                            <div className="group-item-text">
                                                {/* <div className="group-item-section">Section {item?.section}</div> */}
                                                <div className="group-item-section">Section {item?.section}-{subIndex}</div>
                                                <div className="group-item-category">
                                                    {/* <IconBookmarkFilled size="1.2rem" color={sectionButtons[item.section] ? "#fff" : "#000"} /> */}
                                                    <span>{getImageCategory(item?.category)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </div>
                <div className="result-main">
                    <SectionResult 
                        analysisResult={analysisResult} 
                        getImageCategory={getImageCategory} 
                        openSection={openSection} 
                        setOpenSection={setOpenSection} 
                        openSubSection={openSubSection} 
                        setOpenSubsection={setOpenSubsection} 
                        sectionButtons={sectionButtons} 
                        setSectionButtons={setSectionButtons} 
                        sectionButtonsDict={sectionButtonsDict} 
                        setSectionButtonsDict={setSectionButtonsDict}
                    />
                </div>
            </div>
        </div>
        
    );
}