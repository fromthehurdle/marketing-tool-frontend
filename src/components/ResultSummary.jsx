import React from 'react';
import './ResultSummary.css';
import { useState, useEffect } from 'react';
import { Floating, ActionIcon, Checkbox, Image, Button, Input, NativeSelect, Tabs, SegmentedControl, TextInput } from '@mantine/core';
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
  IconHeart, 
  IconHeartFilled,
  IconPointFilled, 
  IconTool, 
  IconEdit, 
  IconCopy, 
  IconBookmark, 
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import CompareComponent from '../components/CompareComponent';
import FloatingTool from './FloatingTool';


export default function ResultSummary() {
    const [showHeart, setShowHeart] = useState(false);

    return (
        <div className="result-summary-container">
            <div className="selling-point">
                <div className="selling-point-header">
                    <span className="selling-point-header-text">주요 소구점</span>
                </div>
                <hr />
                <div className="selling-point-content">
                    <div className="selling-point-item" onMouseOver={() => {
                        setShowHeart(true);
                    }} onMouseLeave={() => {
                        setShowHeart(false);
                    }}>
                        <IconPointFilled size="1rem" color="#000" />
                        <span className="selling-point-text">검증된 오프라인 업체의 국내산 자포니카 민물장어 판매</span>
                        <span className="selling-point-section">Section 2</span>
                        {showHeart && 
                            <IconHeartFilled size="1.2rem" color="#ff6b6b" style={{ marginLeft: '8px' }} className="selling-point-heart-icon" />
                        }                        
                    </div>
                    <div className="selling-point-item" onMouseOver={() => {
                        setShowHeart(true);
                    }} onMouseLeave={() => {
                        setShowHeart(false);
                    }}>
                        <IconPointFilled size="1rem" color="#000" />
                        <span className="selling-point-text">복분자, 장어탕 등 푸짐한 구성</span>
                        <span className="selling-point-section">Section 3</span>
                        {showHeart && 
                            <IconHeartFilled size="1.2rem" color="#ff6b6b" style={{ marginLeft: '8px' }} className="selling-point-heart-icon" />
                        }
                    </div>
                    <div className="selling-point-item" onMouseOver={() => {
                        setShowHeart(true);
                    }} onMouseLeave={() => {
                        setShowHeart(false);
                    }}>
                        <IconPointFilled size="1rem" color="#000" />
                        <span className="selling-point-text">전체 제품 배송비 무료 이벤트</span>
                        <span className="selling-point-section">Section 4</span>
                        {showHeart && 
                            <IconHeartFilled size="1.2rem" color="#ff6b6b" style={{ marginLeft: '8px' }} className="selling-point-heart-icon" />
                        }
                    </div>
                    <div className="selling-point-item" onMouseOver={() => {
                        setShowHeart(true);
                    }} onMouseLeave={() => {
                        setShowHeart(false);
                    }}>
                        <IconPointFilled size="1rem" color="#000" />
                        <span className="selling-point-text">보내는분 성함으로 만드는 감사카드 증정</span>
                        <span className="selling-point-section">Section 5</span>
                        {showHeart && 
                            <IconHeartFilled size="1.2rem" color="#ff6b6b" style={{ marginLeft: '8px' }} className="selling-point-heart-icon" />
                        }
                    </div>
                    <div className="selling-point-item" onMouseOver={() => {
                        setShowHeart(true);
                    }} onMouseLeave={() => {
                        setShowHeart(false);
                    }}>
                        <IconPointFilled size="1rem" color="#000" />
                        <span className="selling-point-text">고급 보자기 포장 가능</span>
                        <span className="selling-point-section">Section 6</span>
                        {showHeart && 
                            <IconHeartFilled size="1.2rem" color="#ff6b6b" style={{ marginLeft: '8px' }} className="selling-point-heart-icon" />
                        }
                    </div>
                </div>
                <div className="selling-point-setting">
                    <FloatingTool />
                </div>
            </div>
            <div className="product-composition">
                <div className="product-composition-header">
                    <span className="product-composition-header-text">주요 소구점</span>
                </div>
                <hr />
                <div className="product-composition-content">
                    <div className="product-composition-setting">
                        <FloatingTool />
                    </div>
                </div>
            </div>
        </div>
    );
}