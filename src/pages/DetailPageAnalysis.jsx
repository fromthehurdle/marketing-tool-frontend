import React from 'react';
import './DetailPageAnalysis.css';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, Box, Checkbox, Image, Button, Input, NativeSelect, Tabs, SegmentedControl, TextInput } from '@mantine/core';
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
  IconDots
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import CompareComponent from '../components/CompareComponent';
import PreAnalysis from '../components/PreAnalysis';
import PostAnalysis from '../components/PostAnalysis';
import { baseUrl } from '../shared';


export default function DetailPageAnalysis() {
    const [activeTab, setActiveTab] = useState('url'); // url, upload 
    const [hoveredItem, setHoveredItem] = useState(null);

    const { analysis_id } = useParams();

    const [resultData, setResultData] = useState([]);
    const [analysisStarted, setAnalysisStarted] = useState(false);

    // const analysisHandler = async () => {
    //     try {   
    //         const response = await fetch(baseUrl + `api/results/4/analyze/`, {
    //             method: 'POST', 
    //             headers: {
    //                 'Content-Type': 'application/json', 
    //                 'Authorization': `Bearer ${localStorage.getItem('access')}`
    //             }, 
    //             body: JSON.stringify({
    //                 sections: [
    //                     {
    //                         "section": 1, 
    //                         "category": "product_description", 
    //                     }, 
    //                     {
    //                         "section": 2, 
    //                         "category": "product_price",
    //                     }
    //                 ]
    //             })
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             console.log("Analysis started successfully:", data); 
    //         }
    //     } catch (error) {
    //         console.error("Error during analysis:", error);
    //     }
    // }

    const getResultData = async () => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${analysis_id}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });

            const data = await response.json(); 
            if (response.ok) {
                console.log("**Result data fetched successfully:", data);
                setResultData(data || {});
            }
        } catch (error) {
            console.error("Error fetching result data:", error);
        }
    }

    // useEffect(() => {
    //     getResultData();
    //     if (resultData?.analysis_status === 'in_progress') {

    //     }
    //     setInterval(() => {
    //         getResultData();
    //     }, 30000);
    // }, []);

    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            await getResultData();
            if (resultData?.analysis_status === "in_progress" && !intervalId) {
            intervalId = setInterval(() => {
                getResultData();
            }, 30000);
            } else if (resultData?.analysis_status !== "in_progress" && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            }
        };

        fetchData();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [resultData?.analysis_status]);

    return (
        <div className="detail-page-analysis-container">
            <div className="compare-section">
                <CompareComponent resultData={resultData}/>
            </div>
            <div className="analysis-action-container">
                <div className="analysis-action-header">
                    <div className="analysis-action-title">
                        <IconFileAnalyticsFilled size="1.5rem" color="#000" />
                        <span className="analysis-action-text">AI 상세페이지 분석</span>
                    </div>
                    <div className="analysis-action-subtitle">
                        <span className="analysis-action-subtitle-text">Gif 파일은 이미지 기반의 정보를 제공합니다</span>
                    </div>
                </div>
                <SegmentedControl
                    value={activeTab}
                    onChange={setActiveTab}
                    data={[
                        {
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <IconSettingsAutomation size="1.5rem" />
                                <span style={{ fontSize: '16px', fontWeight: '500'}}>상세페이지 크롤링</span>
                                </div>
                            ),
                            value: 'url'
                        },
                        {
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <IconUpload size="1.5rem" />
                                <span style={{ fontSize: '16px', fontWeight: '500'}}>직접 이미지 업로드</span>
                                </div>
                            ),
                            value: 'upload'
                        }
                    ]}
                />
                <div className="action-action">
                    <TextInput 
                        className="analysis-action-input"
                        placeholder="https://shopping.naver.com/product/89571111338"
                        label="Product Page URL"
                        variant="filled"
                        value={resultData?.product_url || ''}
                        disabled
                    />
                    <Button
                        leftSection={<IconSearch size="1.5rem" />}
                        variant="filled"
                        color="rgba(0,0,0,1)"
                        className="analysis-action-button"
                        // onClick={() => analysisHandler()}
                    >
                         불러오기
                    </Button>
                </div>
            </div>        
            
            {resultData?.analysis_status === 'pending' &&
                <PreAnalysis resultData={resultData} />
            }
            
            {resultData?.analysis_status === 'in_progress' &&
                <Box pos="relative">
                    <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{color: '#000'}} />
                    <PostAnalysis resultData={resultData} />
                </Box>
            }

            {resultData?.analysis_status === 'completed' &&
                <PostAnalysis resultData={resultData} />
            } 

            {resultData?.analysis_status === 'failed' &&
                <PreAnalysis resultData={resultData} />
            }

            

        </div>
    );
}