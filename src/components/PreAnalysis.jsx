import React from 'react';
import './PreAnalysis.css';
import { useState, useEffect, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Checkbox, Image, Button, Input, NativeSelect, Tabs, SegmentedControl, TextInput, createPolymorphicComponent } from '@mantine/core';
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
  IconExclamationCircle, 
  IconCrop,
  IconPlus,
  IconCopy, 
  IconMinus
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import CompareComponent from '../components/CompareComponent';
import { baseUrl } from '../shared';
import SidebarMenu from './SidebarMenu';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function PreAnalysis(props) {

    const [activeTab, setActiveTab] = useState('url'); // url, upload 
    const [hoveredItem, setHoveredItem] = useState(null);

    const [detailImages, setDetailImages] = useState([]);
    const [imageStates, setImageStates] = useState([]);

    const [opened, { open, close }] = useDisclosure(false);
    const [cropModalOpened, {open: openCropModal, close: closeCropModal}] = useDisclosure(false);
    const [cropSection, setCropSection] = useState(1);

    const [ imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false);
    const [ imageModalUrl, setImageModalUrl ] = useState("");

    const [crops, setCrops] = useState({}); // Object to store crop for each image
    const [completedCrops, setCompletedCrops] = useState({}); // Object to store completed crop for each image
    const imgRefs = useRef({}); // Object to store refs for each image
    const canvasRef = useRef(null); // Ref for the canvas element

    

    const onImageLoad = (e, imageId) => {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
        makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1, // aspect ratio
                width,
                height,
            ),
            width,
            height,
        );
        
        setCrops(prev => ({
            ...prev,
            [imageId]: newCrop
        }));
    };

    const getCroppedImg = (imageId) => {
        const image = imgRefs.current[imageId];
        const canvas = canvasRef.current;
        const crop = completedCrops[imageId];

        if (!image || !canvas || !crop) {
            console.log('Missing required elements for cropping');
            return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY,
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedImageUrl = URL.createObjectURL(blob);
                console.log(`Cropped image for ${imageId}:`, croppedImageUrl);
                // Handle the cropped image (save to state, send to backend, etc.)
            }
        }, 'image/jpeg', 0.9);
    };
        const resetCrop = (imageId) => {
        setCrops(prev => {
            const newCrops = { ...prev };
            delete newCrops[imageId];
            return newCrops;
        });
        setCompletedCrops(prev => {
            const newCompletedCrops = { ...prev };
            delete newCompletedCrops[imageId];
            return newCompletedCrops;
        });
    };

    // Optional: Add function to reset all crops when modal closes
    const resetAllCrops = () => {
        setCrops({});
        setCompletedCrops({});
    };

    // You can call resetAllCrops when closing the crop modal
    // Update your modal close function:
    const closeCropModalWithReset = () => {
        resetAllCrops();
        closeCropModal();
    };


    const getDetailImages = async () => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${props?.resultData?.id}/images/`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}` 
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Detail images fetched successfully:", data);
                setDetailImages(data);
                setImageStates(data.map((image) => {
                    return {
                        id: image.id,
                        section: image.section || 1,
                        category: image.category || 'product_option', 
                        checked: false
                    };
                }));
            }
        } catch (error) {
            console.error("Error fetching detail images:", error);
        }
    }

    useEffect(() => {
        if (props?.resultData) {
            getDetailImages();
        }
    }, [props?.resultData]);


    const imageBulkUpdate = async (newImageStates) => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${props?.resultData?.id}/bulk_update_images/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('access')}` 
                }, 
                body: JSON.stringify({
                    images: newImageStates
                })
            });

            if (response.ok) {
                getDetailImages();
            }
        } catch (error) {
            console.error("Error during image bulk update:", error);
        }
    }

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

    const analyzeResult = async () => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${props?.resultData?.id}/analyze/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}` 
                }, 
                body: JSON.stringify({
                    sections: imageStates.map(image => ({
                        id: image.id,
                        section: image.section,
                        category: image.category
                    }))
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Analysis started successfully:", data);
            }
        } catch (error) {
            console.error("Error during analysis:", error);
        }
    }
    
    const checkGrouping = (value, type) => {
        
        if (type === "section") {
            // const filteredImages = new Set(imageStates.filter(image => image.section === value).map((image) => image.category));
            // if (filteredImages.size > 1) {
            //     open();
            //     set
            // }
        } else if (type === "category") {
            const filteredImages = new Set(imageStates.filter(image => image.category === value).map((image) => image.section));
            if (filteredImages.size >  1) {
                open();
            }

        }
    }

    const groupingHandler = async () => {
        try {
            const leastSectionForCategory = Math.min(imageStates.filter(image => image.category === value).map((image) => image.section));
            setImageStates(prev => prev.map(image => {
                if (image.category === value) {
                    return {
                        ...image,
                        section: leastSectionForCategory
                    };
                }
                return image;
            }));
        } catch (error) {
            console.error("Error during grouping:", error);
        }
    }

    const sectionOptions = React.useMemo(() => {
        const n = props?.resultData?.image_count ?? 0;
        return Array.from({ length: n }, (_, i) => ({
            value: String(i + 1),
            label: `Section ${i + 1}`,
        }));
    }, [props?.resultData?.image_count]);

    
    return (
        <div className="analysis-crawled-container">
            <Modal size="lg" opened={imageModalOpened} onClose={closeImageModal}>
                <Image 
                    src={imageModalUrl || "https://placehold.co/600x400?text=Placeholder"}
                    alt="Crawled Image"
                />
            </Modal>
            <Modal size="auto" opened={opened} onClose={close} title={
                <div className="preanalysis-modal-header">
                    <IconExclamationCircle size="1.5rem" />
                    <span className="preanalysis-modal-title">카테고리가 같은 이미지가 있습니다. 섹션을 병합 하시겠습니까?</span>
                </div>
            }>
                <div className="preanalysis-modal-content">
                    <hr className="preanalysis-modal-separator"/>
                    <span className="preanalysis-modal-text">디스크립션</span>
                    <div className="preanalysis-modal-buttons">
                        <Button 
                            onClick={close}
                            color="#000"
                        >No</Button>
                        <Button 
                            onClick={groupingHandler}
                            color="#000"
                        >Yes</Button>
                    </div>
                </div>
            </Modal>

            <Modal size="auto" opened={cropModalOpened} onClose={closeCropModal} title={
                <div className="crop-header">
                    <div className="crop-header-title">
                        <IconCrop size="1.5rem" />
                        <span className="crop-header-title-text">이미지 크롭하기</span>
                    </div>
                    <div className="crop-header-sub-title">
                        <span className="crop-header-sub-title-text">이미지를 클릭하여 간편하게 이미지를 크롭할 수 있습니다.</span>
                    </div>
                </div>
            }>
                <div className="crop-content">
                    <div className="crawled-sidebar">
                        <div className="manage-analysis">
                            <div className="manage-analysis-header">
                                <span className="manage-analysis-header-text">이미지 크롭 관리</span>
                                {/* <span className="manage-analysis-header-subtext">이미지의 섹션, 카테고리를 나눠주세요</span> */}
                            </div>
                            <div className="manage-analysis-content">
                                <Checkbox 
                                    label={
                                        <span className="manage-analysis-checkbox-text">Select All</span>
                                    }
                                    color="rgba(0, 0, 0, 1)"
                                    radius="xs"
                                    onChange={(e) => {
                                        const newImageStates = imageStates.map(image => ({
                                            ...image,
                                            checked: e.target.checked
                                        }));
                                        setImageStates(newImageStates);
                                    }}
                                    checked={imageStates.every(image => image.checked)}
                                />
                                <span className="manage-analysis-selected-count">
                                    {imageStates.filter(image => image.checked).length} selected
                                </span>
                            </div>
                            <hr />
                            <div className="manage-analysis-footer">
                                <Button
                                    variant="filled"
                                    color="rgba(0,0,0,1)"
                                    className="manage-analysis-button"
                                    onClick={() => {
                                        analyzeResult();
                                    }}
                                >
                                    저장하기
                                </Button>
                            </div>
                        </div>
                        <div className="manage-grouping">
                            <div className="manage-grouping-header">
                                <span className="manage-grouping-header-text">섹션 관리</span>
                                <span className="manage-grouping-header-subtext">이미지에 섹션과 카테고리가 설정되면 여기서 분석할 섹션을 관리할 수 있습니다.</span>
                            </div>
                            <div className="grouping-item-container">
                                {detailImages?.filter(image => image.section === cropSection)?.map((image, index) => {
                                    return (
                                        <div className="grouping-item">
                                            <Checkbox
                                                color="rgba(0, 0, 0, 1)"
                                                onChange={(e) => {
                                                    const newImageStates = [...imageStates];
                                                    newImageStates[index].checked = e.target.checked;
                                                    setImageStates(newImageStates);
                                                }}
                                                checked={imageStates[index]?.checked || false}
                                            />
                                            <div className="group-item-text">
                                                <div className="group-item-section">{image?.section ? `Section ${image?.section}` : "TBD"}</div>
                                                <span className="group-item-category">{image?.category ? `${getImageCategory(image?.category)}` : "TBD"}</span>
                                            </div>
                                            <SidebarMenu openCropModal={openCropModal} />                                                               
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="crop-main">
                        {detailImages?.filter(image => image.section === cropSection).map((image, index) => {
                            return (
                                <div key={index} className="crop-item">                            
                                    <div className="crop-image-container">
                                        {/* <ReactCrop
                                            crop={crop}
                                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                                            onComplete={(c) => {
                                                setCompletedCrop(c);
                                            }}
                                            aspect={1}
                                        >
                                            <Image 
                                                src={image?.url.substring(8) || "https://placehold.co/600x400?text=Placeholder"}
                                                alt="Crawled Image"
                                                className="crop-image"
                                                onLoad={onImageLoad}
                                            />
                                        </ReactCrop> */}
                                        <ReactCrop
                                            crop={crops[image.id] || undefined}
                                            onChange={(_, percentCrop) => {
                                                setCrops(prev => ({
                                                    ...prev,
                                                    [image.id]: percentCrop
                                                }));
                                            }}
                                            onComplete={(c) => {
                                                setCompletedCrops(prev => ({
                                                    ...prev,
                                                    [image.id]: c
                                                }));
                                            }}
                                            // aspect={1} // Remove this if you want free-form cropping
                                            minWidth={50}
                                            minHeight={50}
                                        >
                                            <img 
                                                ref={(el) => {
                                                    if (el) {
                                                        imgRefs.current[image.id] = el;
                                                    }
                                                }}
                                                src={image?.url.substring(8) || "https://placehold.co/600x400?text=Placeholder"}
                                                alt="Crawled Image"
                                                className="crop-image"
                                                onLoad={(e) => onImageLoad(e, image.id)}
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </ReactCrop>
                    
                                        {/* Hidden canvas for crop processing - keep single canvas */}
                                        <canvas
                                            ref={canvasRef}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="crop-image-menu">
                                            <span className="crop-menu-icon">
                                                <IconPlus size="1.5rem" color="#000" />
                                            </span>
                                            <span className="crop-menu-icon">
                                                <IconMinus size="1.5rem" color="#000" />
                                            </span>
                                            <span className="crop-menu-icon">
                                                <IconCopy size="1.5rem" color="#000" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="crop-image-properties">
                                        <NativeSelect 
                                            placeholder="Section"
                                            data={sectionOptions}
                                            className="crop-item-grouping-select"
                                            color="rgba(1, 1, 1, 1)"
                                            radius="8px"
                                            value={image?.section || ''}
                                            onChange={(e) => {
                                                const newImageStates = [...imageStates];
                                                newImageStates[index].section = e.target.value;
                                                setImageStates(newImageStates);
                                            }}
                                        />
                                        <NativeSelect 
                                            placeholder="Categories"
                                            data={[
                                                {value: "product_option", label: "Product Option"},
                                                {value: "product_description", label: "Product Description"}, 
                                                {value: "specifications", label: "Specifications"},
                                                {value: "usage_guide", label: "Usage Guide"},
                                                {value: "ingredients", label: "Ingredients"},
                                                {value: "size_chart", label: "Size Chart"},
                                                {value: "warranty", label: "Warranty"},
                                                {value: "other", label: "Other"}
                                            ]}
                                            className="crop-item-grouping-select"
                                            radius="8px"
                                            value={image?.category || ''}
                                            onChange={(e) => {
                                                const newImageStates = [...imageStates];
                                                newImageStates[index].category = e.target.value;
                                                setImageStates(newImageStates);
                                            }}
                                        />
                                    </div>
                                </div>
                            );  
                        })}
                        {/* <div className="crop-item">                            
                            <div className="crop-image-container">
                                <Image 
                                    src={detailImages[0]?.url.substring(8) || "https://placehold.co/600x400?text=Placeholder"}
                                    alt="Crawled Image"
                                    className="crop-image"
                                />
                                <div className="crop-image-menu">
                                    <span className="crop-menu-icon">
                                        <IconPlus size="1.5rem" color="#000" />
                                    </span>
                                    <span className="crop-menu-icon">
                                        <IconMinus size="1.5rem" color="#000" />
                                    </span>
                                    <span className="crop-menu-icon">
                                        <IconCopy size="1.5rem" color="#000" />
                                    </span>
                                </div>
                            </div>
                            <div className="crop-image-properties">
                                <NativeSelect 
                                    placeholder="Section"
                                    data={sectionOptions}
                                    className="crop-item-grouping-select"
                                    color="rgba(1, 1, 1, 1)"
                                    radius="8px"
                                    value={imageStates[0]?.section || ''}
                                    onChange={(e) => {
                                        const newImageStates = [...imageStates];
                                        newImageStates[0].section = e.target.value;
                                        setImageStates(newImageStates);
                                    }}
                                />
                                <NativeSelect 
                                    placeholder="Categories"
                                    data={[
                                        {value: "product_option", label: "Product Option"},
                                        {value: "product_description", label: "Product Description"}, 
                                        {value: "specifications", label: "Specifications"},
                                        {value: "usage_guide", label: "Usage Guide"},
                                        {value: "ingredients", label: "Ingredients"},
                                        {value: "size_chart", label: "Size Chart"},
                                        {value: "warranty", label: "Warranty"},
                                        {value: "other", label: "Other"}
                                    ]}
                                    className="crop-item-grouping-select"
                                    radius="8px"
                                    value={imageStates[0]?.category || ''}
                                    onChange={(e) => {
                                        const newImageStates = [...imageStates];
                                        newImageStates[0].category = e.target.value;
                                        setImageStates(newImageStates);
                                    }}
                                />
                            </div>
                        </div> */}
                    </div>

                </div>
            </Modal>
            <div className="analysis-crawled-header">
                <Image src="" w={40} h={40} fallbackSrc="https://placehold.co/600x400?text=Placeholder"/>
                <div className="analysis-crawled-header-text">
                    <span className="analysis-crawled-header-title">{props?.resultData?.product}</span>
                    <span className="analysis-crawled-header-subtitle">Completed {props?.resultData?.created_at.split("T")[0]} {props?.resultData?.created_at.split("T")[1].split(".")[0]}</span>
                </div>
            </div>
            <hr style={{marginTop: "-16px"}} />
            
            <div className="analysis-crawled-content">
                <div className="crawled-sidebar">
                    <div className="manage-analysis">
                        <div className="manage-analysis-header">
                            <span className="manage-analysis-header-text">페이지 분석 관리</span>
                            <span className="manage-analysis-header-subtext">이미지의 섹션, 카테고리를 나눠주세요</span>
                        </div>
                        <div className="manage-analysis-content">
                            <Checkbox 
                                label={
                                    <span className="manage-analysis-checkbox-text">Select All</span>
                                }
                                color="rgba(0, 0, 0, 1)"
                                radius="xs"
                                onChange={(e) => {
                                    const newImageStates = imageStates.map(image => ({
                                        ...image,
                                        checked: e.target.checked
                                    }));
                                    setImageStates(newImageStates);
                                }}
                                checked={imageStates.every(image => image.checked)}
                            />
                            <span className="manage-analysis-selected-count">
                                {imageStates.filter(image => image.checked).length} selected
                            </span>
                        </div>
                        <hr />
                        <div className="manage-analysis-footer">
                            <Button
                                leftSection={<IconChartBar size="1.5rem" />}
                                variant="filled"
                                color="rgba(0,0,0,1)"
                                className="manage-analysis-button"
                                onClick={() => {
                                    analyzeResult();
                                }}
                            >
                                페이지 분석하기 (0)
                            </Button>
                        </div>
                    </div>
                    <div className="manage-grouping">
                        <div className="manage-grouping-header">
                            <span className="manage-grouping-header-text">섹션 관리</span>
                            <span className="manage-grouping-header-subtext">이미지에 섹션과 카테고리가 설정되면 여기서 분석할 섹션을 관리할 수 있습니다.</span>
                        </div>
                        <div className="grouping-item-container">
                            {detailImages?.map((image, index) => {
                                return (
                                    <div className="grouping-item">
                                        <Checkbox
                                            color="rgba(0, 0, 0, 1)"
                                            onChange={(e) => {
                                                const newImageStates = [...imageStates];
                                                newImageStates[index].checked = e.target.checked;
                                                setImageStates(newImageStates);
                                            }}
                                            checked={imageStates[index]?.checked || false}
                                        />
                                        <div className="group-item-text">
                                            <div className="group-item-section">{image?.section ? `Section ${image?.section}` : "TBD"}</div>
                                            <span className="group-item-category">{image?.category ? `${getImageCategory(image?.category)}` : "TBD"}</span>
                                        </div>
                                        <SidebarMenu openCropModal={openCropModal} setCropSection={setCropSection} section={image.section} />                                                               
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="crawled-main">
                    {detailImages?.map((image, index) => {
                        return (
                            <div key={index} className="crawled-item" 
                                onMouseEnter={() => setHoveredItem(image.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {hoveredItem === image.id && (
                                    <>
                                        <div className="crawled-item-menu">
                                            {/* <IconDots size="1.5rem" color="#E5E5EC" /> */}
                                            <SidebarMenu openCropModal={openCropModal} setCropSection={setCropSection} section={image.section} />                                                               
                                        </div>
                                        <div className="crawled-item-zoom">
                                            <IconSearch size="1.5rem" onClick={() => {
                                                setImageModalUrl(image?.url.substring(8));
                                                openImageModal();
                                            }} />
                                        </div>
                                    </>
                                )}
                                <Image 
                                    src={image?.url.substring(8) || "https://placehold.co/600x400?text=Placeholder"}
                                    alt="Crawled Image" 
                                    className="crawled-image"
                                    // style={{ minWidth: '300px', minHeight: '472px' }}
                                    fit="contain"
                                />
                                <div className="crawled-item-grouping">
                                    <NativeSelect 
                                        // variant="filled"
                                        placeholder="Section"
                                        data={sectionOptions}
                                        className="crawled-item-grouping-select"
                                        color="rgba(1, 1, 1, 1)"
                                        radius="8px"
                                        value={imageStates[index]?.section || ''}
                                        onChange={(e) => {
                                            const newImageStates = [...imageStates];
                                            newImageStates[index].section = e.target.value;
                                            setImageStates(newImageStates);
                                            imageBulkUpdate(newImageStates.map((image) => ({ id: image.id, section: image.section, category: image.category })));
                                            // checkGrouping(e.target.value, "section");
                                        }}
                                    />
                                    <NativeSelect 
                                        // variant="filled"                                    
                                        placeholder="Categories"
                                        data={[
                                            {value: "product_option", label: "Product Option"},
                                            {value: "product_description", label: "Product Description"}, 
                                            {value: "specifications", label: "Specifications"},
                                            {value: "usage_guide", label: "Usage Guide"},
                                            {value: "ingredients", label: "Ingredients"},
                                            {value: "size_chart", label: "Size Chart"},
                                            {value: "warranty", label: "Warranty"},
                                            {value: "other", label: "Other"}
                                        ]}
                                        className="crawled-item-grouping-select"
                                        radius="8px"
                                        value={imageStates[index]?.category || ''}
                                        onChange={(e) => {
                                            const newImageStates = [...imageStates];
                                            newImageStates[index].category = e.target.value;
                                            setImageStates(newImageStates);
                                            imageBulkUpdate(newImageStates.map((image) => ({ id: image.id, section: image.section, category: image.category })));
                                            // checkGrouping(e.target.value, "category");
                                            
                                        }}
                                    />
                                </div>
                            </div> 
                        );
                        
                    })}
                </div>
            </div>

        </div>
    );
}