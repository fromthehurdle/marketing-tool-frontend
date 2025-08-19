import React from 'react';
import './SectionResult.css';
import { useState, useEffect } from 'react';
import { Checkbox, Image, Button, Input, NativeSelect, Tabs, SegmentedControl, TextInput } from '@mantine/core';
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
  IconPointFilled,
  IconPoint,
  IconChevronDown, 
  IconPhoto,
  IconPhotoFilled, 
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import CompareComponent from '../components/CompareComponent';
import FloatingTool from './FloatingTool';

import { Accordion } from '@mantine/core';


export default function SectionResult() {

    return (
        <div className="section-result-container">
            <Accordion defaultValue="section1">
    <Accordion.Item value="section1" className="section-result-item">
        <Accordion.Control>
            <div className="section-result-header">
                <IconPointFilled size="1.2rem" color="#63F37B" />
                <span className="section-result-header-text">Section 1 : 메인 비쥬얼</span>
            </div>
        </Accordion.Control>
        <Accordion.Panel>
            <div className="section-result-content">
                <Image 
                    src="https://placehold.co/600x400?text=Placeholder"
                    alt="Section 1 Image"
                    className="section-result-image"
                />
                <div className="section-result-text">
                    <div className="section-result-text-type">
                        <IconPhotoFilled size="1.2rem" color="#000" />
                    </div>
                    <div className="section-result-text-header">
                        <span className="section-result-text-header-title">분석 결과</span>
                    </div>
                    <hr />
                    <div className="section-result-text-content">
                        <div className="section-result-text-content-item">
                            <IconPointFilled size="1.2rem" color="#000" />
                            <span className="section-result-text-content-text">이미지 구성 : 손질된 장어, 장어탕, 복분자, 소스류, 보냉팩</span>
                        </div>
                        <div className="section-result-text-content-item">
                            <IconPointFilled size="1.2rem" color="#000" />
                            <span className="section-result-text-content-text">온 가족이 따뜻하게 즐기는 : 정서적 소구, 가족과 함께하는 따뜻한 식사</span>
                        </div>
                        <div className="section-result-text-content-item">
                            <IconPointFilled size="1.2rem" color="#000" />
                            <span className="section-result-text-content-text">대청장어가 장어 선물세트 : 브랜드 제품명 강조, 선물 목적이 명확함</span>
                        </div>
                    </div>
                    <FloatingTool />
                </div>
            </div>
        </Accordion.Panel>
    </Accordion.Item>
</Accordion>
            <div className="section-result-item">
                <div className="section-result-header">
                    <IconPointFilled size="1.2rem" color="#63F37B" />
                    <span className="section-result-header-text">Section 1 : 메인 비쥬얼</span>
                    <IconChevronDown size="1.2rem" color="#000" className="section-result-header-icon" />
                </div>
                <div className="section-result-content">
                    <Image 
                        src="https://placehold.co/600x400?text=Placeholder"
                        alt="Section 1 Image"
                        className="section-result-image"
                    />
                    <div className="section-result-text">
                        <div className="section-result-text-type">
                            <IconPhotoFilled size="1.2rem" color="#000" />
                        </div>
                        <div className="section-result-text-header">
                            <span className="section-result-text-header-title">분석 결과</span>
                        </div>
                        <hr />
                        <div className="section-result-text-content">
                            <div className="section-result-text-content-item">
                                <IconPointFilled size="1.2rem" color="#000" />
                                <span className="section-result-text-content-text">이미지 구성 : 손질된 장어, 장어탕, 복분자, 소스류, 보냉팩</span>
                            </div>
                            <div className="section-result-text-content-item">
                                <IconPointFilled size="1.2rem" color="#000" />
                                <span className="section-result-text-content-text">온 가족이 따뜻하게 즐기는 : 정서적 소구, 가족과 함께하는 따뜻한 식사</span>
                            </div>
                            <div className="section-result-text-content-item">
                                <IconPointFilled size="1.2rem" color="#000" />
                                <span className="section-result-text-content-text">대청장어가 장어 선물세트 : 브랜드 제품명 강조, 선물 목적이 명확함</span>
                            </div>
                        </div>
                        <FloatingTool />
                    </div>

                </div>
            </div>
            <div className="section-result-item section-not-shown">
                <div className="section-result-header">
                    <IconPointFilled size="1.2rem" color="#63F37B" />
                    <span className="section-result-header-text">Section 1 : 메인 비쥬얼</span>
                    <IconChevronDown size="1.2rem" color="#000" className="section-result-header-icon" />
                </div>
                <div className="section-result-content">
                    <Image 
                        src="https://placehold.co/600x400?text=Placeholder"
                        alt="Section 1 Image"
                        className="section-result-image"
                    />
                    <div className="section-result-text">
                        <div className="section-result-text-type">
                            <IconPhotoFilled size="1.2rem" color="#000" />
                        </div>
                        <div className="section-result-text-header">
                            <span className="section-result-text-header-title">분석 결과</span>
                        </div>
                        <hr />
                        <div className="section-result-text-content">
                            <div className="section-result-text-content-item">
                                <IconPointFilled size="1.2rem" color="#000" />
                                <span className="section-result-text-content-text">이미지 구성 : 손질된 장어, 장어탕, 복분자, 소스류, 보냉팩</span>
                            </div>
                            <div className="section-result-text-content-item">
                                <IconPointFilled size="1.2rem" color="#000" />
                                <span className="section-result-text-content-text">온 가족이 따뜻하게 즐기는 : 정서적 소구, 가족과 함께하는 따뜻한 식사</span>
                            </div>
                            <div className="section-result-text-content-item">
                                <IconPointFilled size="1.2rem" color="#000" />
                                <span className="section-result-text-content-text">대청장어가 장어 선물세트 : 브랜드 제품명 강조, 선물 목적이 명확함</span>
                            </div>
                        </div>
                        <FloatingTool />
                    </div>

                </div>
            </div>
        </div>
    );
}