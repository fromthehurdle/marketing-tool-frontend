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
import ResultTable from './ResultTable';

import { Accordion } from '@mantine/core';


export default function SectionResult(props) {
    const [activeSection, setActiveSection] = useState(null);   

    useEffect(() => {
        if (props.openSection !== undefined && props.openSection !== null) {
            setActiveSection(`section${props.openSection}`);
        }
    }, [props.openSection]);

    const EditableSection = ({ section, index }) => {
        const [isEditing, setIsEditing] = useState(false);
        
        return (
            <>
                <div className="section-result-text-content" contentEditable={isEditing}>
                    {section?.result_json?.analysis && section?.result_json?.analysis !== "undefined" && JSON.parse(section?.result_json?.analysis)?.return_type === "sectioned" ? 
                        (JSON.parse(section?.result_json?.analysis)?.sections?.map((sectionItem, index) => {
                            console.log("Section Item: ", sectionItem);
                            return (
                                <div key={index} className="sectioned-text">
                                    <div className="section-result-title">
                                        <span className="sectioned-text-title">{sectionItem.title}</span>
                                    </div>
                                    {sectionItem?.content_type === "text" && 
                                        <div className="section-result-item">
                                            {Array.isArray(sectionItem?.content) 
                                                ? sectionItem.content.map((item, index) => (
                                                    <span key={index} className="sectioned-text-item">{item}</span>
                                                ))
                                                : <span className="sectioned-text-item">{sectionItem?.content}</span>
                                            }
                                        </div>
                                    }
                                    {sectionItem?.content_type === "bullet" && 
                                        <div className="section-result-item">
                                            {sectionItem?.content?.map((item, index) => {
                                                return (
                                                    <ul key={index}>
                                                        <li className="sectioned-text-item">{item}</li>
                                                    </ul>
                                                );
                                            })}
                                        </div>
                                    }
                                    {sectionItem?.content_type === "table" && sectionItem?.headers &&
                                        <div className="section-result-item">
                                            <ResultTable columns={sectionItem?.headers} resultData={sectionItem?.rows} />
                                        </div>
                                    }                                    
                                </div>
                            );
                        }))
                    : null }
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
                                ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                                "summary": false,
                                [section.section]: true  // Always set to true, don't toggle
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
                                        src={section?.result_json?.image_urls[0] || "https://placehold.co/600x400?text=Placeholder"}
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