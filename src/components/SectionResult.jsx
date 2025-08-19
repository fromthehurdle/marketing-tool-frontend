import React from 'react';
import './SectionResult.css';
import { useState, useEffect, useRef } from 'react';
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


export default function SectionResult(props) {
    const [activeSection, setActiveSection] = useState(null);   

    useEffect(() => {
        console.log("Open Section:", props.openSection);
        if (props.openSection !== undefined && props.openSection !== null) {
            setActiveSection(`section${props.openSection}`);
            console.log("Active Section set to:", `section${props.openSection}`);
        }
    }, [props.openSection]);

    const EditableSection = ({ section, index }) => {
        const [isEditing, setIsEditing] = useState(false);

        return (
            <>
                <div className="section-result-text-content" contentEditable={isEditing}>
                    {section?.result_json?.analysis}
                </div>
                <FloatingTool text={section?.result_json?.analysis} isEditing={isEditing} setIsEditing={setIsEditing} />
            </>
        );
    }

    return (
        <div className="section-result-container">
            {props.analysisResult?.map((section, index) => {
                const sectionKey = `section${section?.section || index + 1}`;
                return (
                    <Accordion 
                        // key={index} 
                        // defaultValue="section1"
                        key={index}
                        value={activeSection}
                        onChange={setActiveSection}

                    >
                        <Accordion.Item value={sectionKey} className="section-result-item" onClick={() => {
                            if (props.sectionButtons[section?.section]) {
                                props.setOpenSection(null);
                            } else {
                                props.setOpenSection(section?.section);
                            }

                            props.setSectionButtons(prev => ({
                                ...prev,
                                "summary": false,
                                [section?.section]: !prev[section?.section]
                            }));
                        }}>
                            <Accordion.Control>
                                <div className="section-result-header">
                                    <IconPointFilled size="1.2rem" color="#63F37B" />
                                    <span className="section-result-header-text">Section {section?.section} : {props.getImageCategory(section?.category)}</span>
                                </div>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <div className="section-result-content">
                                    <Image 
                                        src={section?.result_json?.image_urls[0].substring(8) || "https://placehold.co/600x400?text=Placeholder"}
                                        alt="Section 1 Image"
                                        className="section-result-image"
                                        fit="contain"
                                    />
                                    <div className="section-result-text">
                                        <div className="section-result-text-type">
                                            <IconPhotoFilled size="1.2rem" color="#000" />
                                        </div>
                                        <div className="section-result-text-header">
                                            <span className="section-result-text-header-title">분석 결과</span>
                                        </div>
                                        <hr />
                                        <EditableSection section={section} index={index} />
                                    </div>
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>        
                );
            })}
        </div>
    );
}