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

    const [cropId, setCropId] = useState(null);

    const [ imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false);
    const [ imageModalUrl, setImageModalUrl ] = useState("");

    const [crops, setCrops] = useState({}); // Object to store crop for each image
    const [completedCrops, setCompletedCrops] = useState({}); // Object to store completed crop for each image
    const imgRefs = useRef({}); // Object to store refs for each image
    const canvasRef = useRef(null); // Ref for the canvas element

    const [croppedImages, setCroppedImages] = useState({});
    const [cropImageList, setCropImageList] = useState([]);

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

    // const getCroppedImg = (imageId) => {
    //     const image = imgRefs.current[imageId];
    //     const canvas = canvasRef.current;
    //     const crop = completedCrops[imageId];

    //     if (!image || !canvas || !crop) {
    //         console.log('Missing required elements for cropping');
    //         return;
    //     }

    //     const scaleX = image.naturalWidth / image.width;
    //     const scaleY = image.naturalHeight / image.height;
    //     const ctx = canvas.getContext('2d');

    //     canvas.width = crop.width * scaleX;
    //     canvas.height = crop.height * scaleY;

    //     ctx.drawImage(
    //         image,
    //         crop.x * scaleX,
    //         crop.y * scaleY,
    //         crop.width * scaleX,
    //         crop.height * scaleY,
    //         0,
    //         0,
    //         crop.width * scaleX,
    //         crop.height * scaleY,
    //     );

    //     console.log("crop.x", crop.x, "crop.y", crop.y, "crop.width", crop.width, "crop.height", crop.height);
    //     canvas.toBlob((blob) => {
    //         if (blob) {
    //             const croppedImageUrl = URL.createObjectURL(blob);
    //             console.log(`Cropped image for ${imageId}:`, croppedImageUrl);
    //             // Handle the cropped image (save to state, send to backend, etc.)
    //         }
    //     }, 'image/jpeg', 0.9);
    // };
    //     const resetCrop = (imageId) => {
    //     setCrops(prev => {
    //         const newCrops = { ...prev };
    //         delete newCrops[imageId];
    //         return newCrops;
    //     });
    //     setCompletedCrops(prev => {
    //         const newCompletedCrops = { ...prev };
    //         delete newCompletedCrops[imageId];
    //         return newCompletedCrops;
    //     });
    // };


    // 2. Updated getCroppedImg function that saves the blob
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
                
                // Save to state
                setCroppedImages(prev => ({
                    ...prev,
                    [imageId]: {
                        url: croppedImageUrl,
                        blob: blob,
                        timestamp: Date.now()
                    }
                }));

                // // Option 1: Open in new tab to verify it works
                // window.open(croppedImageUrl, '_blank');

                // // Option 2: Show in your existing image modal
                // setImageModalUrl(croppedImageUrl);
                // openImageModal();

                // // Option 3: Download the image automatically
                // downloadCroppedImage(croppedImageUrl, imageId);

                // Option 4: Upload to server
                uploadCroppedImage(blob, imageId);
            }
        }, 'image/jpeg', 0.9);
    };

    // 3. Function to download the cropped image
    const downloadCroppedImage = (imageUrl, imageId) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `cropped-image-${imageId}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 4. Function to upload cropped image to server
    const uploadCroppedImage = async (blob, imageId) => {
        const formData = new FormData();
        formData.append('cropped_image', blob, `cropped-${imageId}.jpg`);
        formData.append('original_image_id', imageId);

        try {
            // Show loading state
            console.log('Uploading cropped image...');
            
            const response = await fetch(baseUrl + `api/result-items/upload_image/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                    // Don't set Content-Type header - let the browser set it with boundary for FormData
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Cropped image uploaded successfully:', data);
                
                // Update your state with the new image URL
                setCroppedImages(prev => ({
                    ...prev,
                    [imageId]: {
                        ...prev[imageId],
                        uploadedUrl: data.image_url,
                        filename: data.filename,
                        uploaded: true
                    }
                }));

                // Show success message
                
                // Optionally refresh the images list
                // getDetailImages();
                
                // return data;
                saveCroppedImage(data.image_url);
            } else {
                console.error('Failed to upload cropped image:', data);
                alert(`Upload failed: ${data.error || 'Unknown error'}`);
                return null;
            }
        } catch (error) {
            console.error('Error uploading cropped image:', error);
            alert('Upload failed due to network error');
            return null;
        }
    };

    const saveCroppedImage = async (url) => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${props?.resultData?.id}/images/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('access')}` 
                }, 
                body: JSON.stringify({
                    url: url.substring(8), 
                    section: 1, 
                    category: "product_option",
                })
            }); 

            const data = await response.json();

            if (response.ok) {
                console.log("Cropped image saved successfully");
                setCropImageList(prev => [...prev, data?.id]);
                getDetailImages(); // Refresh the images list after saving
            }
        } catch (error) {
            console.error("Error saving cropped image:", error);
        }
    }

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
                        section: image.section || '',
                        category: image.category || '', 
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
            case 'hook':
                return 'Hook';
            case 'promotion':
                return 'Promotion';
            case 'selling_point': 
                return 'Selling Point';
            case 'product_option':
                return 'Product Option';
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

    const analyzeResult = async () => {
        try {
            const checkedImages = imageStates.filter(image => image.checked);

            if (checkedImages.length === 0) {
                return;
            }

            const response = await fetch(baseUrl + `api/result-items/${props?.resultData?.id}/analyze/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}` 
                }, 
                body: JSON.stringify({
                    sections: checkedImages.map(image => ({
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

    // const sectionOptions = React.useMemo(() => {
    //     const n = props?.resultData?.image_count ?? 0;
    //     return Array.from({ length: n }, (_, i) => ({
    //         value: String(i + 1),
    //         label: `Section ${i + 1}`,
    //     }));
    // }, [props?.resultData?.image_count]);

    const sectionOptions = React.useMemo(() => {
        const n = props?.resultData?.image_count ?? 0;
        return [
            { value: '', label: '' }, // Empty option for no selection
            ...Array.from({ length: n }, (_, i) => ({
                value: String(i + 1),
                label: `Section ${i + 1}`,
            }))
        ];
    }, [props?.resultData?.image_count]);

    const handleCrop = (imageId) => {
        getCroppedImg(imageId);
    }

    const getImageUrl = (url) => {
        if (url?.includes("https://https://")) {
            return url.substring(8);
        } else {
            return `${url}`;
        }
    }

    const handleImageDelete = async (imageId) => {
        try {
            const response = await fetch(baseUrl + `api/result-items/${props?.resultData?.id}/images/`, {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }, 
                body: JSON.stringify({
                    image_id: imageId,
                })
            });

            if (response.ok) {
                getDetailImages();
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    }


    // // Helper function to get the next available section for a category
    // const getNextAvailableSection = (selectedCategory, currentImageStates, excludeImageId = null) => {
    //     const maxSections = props?.resultData?.image_count ?? 0;
        
    //     // Get all sections currently used by other categories (excluding the selected category)
    //     const usedSections = new Set();
    //     currentImageStates.forEach(imageState => {
    //         if (imageState.category && 
    //             imageState.category !== selectedCategory && 
    //             imageState.section &&
    //             imageState.id !== excludeImageId) {
    //             usedSections.add(parseInt(imageState.section));
    //         }
    //     });
        
    //     // Find the first available section
    //     for (let i = 1; i <= maxSections; i++) {
    //         if (!usedSections.has(i)) {
    //             return i.toString();
    //         }
    //     }
        
    //     return '1'; // fallback
    // };

    // // Helper function to check if a section is available for a category
    // const isSectionAvailableForCategory = (section, category, currentImageStates, excludeImageId = null) => {
    //     if (!section || !category) return true;
        
    //     // Check if any other category is using this section
    //     return !currentImageStates.some(imageState => 
    //         imageState.category && 
    //         imageState.category !== category && 
    //         imageState.section === section &&
    //         imageState.id !== excludeImageId
    //     );
    // };

    // // Modified section change handler
    // const handleSectionChange = (imageId, newSection, imageIndex) => {
    //     const currentImage = imageStates[imageIndex];
    //     const currentCategory = currentImage.category;
        
    //     if (!currentCategory) {
    //         // If no category is set, just update the section for this image
    //         const newImageStates = [...imageStates];
    //         newImageStates[imageIndex].section = newSection;
    //         setImageStates(newImageStates);
    //         imageBulkUpdate([{ id: imageId, section: newSection, category: currentCategory }]);
    //         return;
    //     }
        
    //     // Check if the new section is available for this category
    //     if (!isSectionAvailableForCategory(newSection, currentCategory, imageStates, imageId)) {
    //         alert(`Section ${newSection} is already used by another category. Please choose a different section.`);
    //         return;
    //     }
        
    //     // Update all images with the same category to have the same section
    //     const newImageStates = imageStates.map(imageState => {
    //         if (imageState.category === currentCategory) {
    //             return {
    //                 ...imageState,
    //                 section: newSection
    //             };
    //         }
    //         return imageState;
    //     });
        
    //     setImageStates(newImageStates);
        
    //     // Bulk update all images with the same category
    //     const imagesToUpdate = newImageStates
    //         .filter(imageState => imageState.category === currentCategory)
    //         .map(imageState => ({ 
    //             id: imageState.id, 
    //             section: imageState.section, 
    //             category: imageState.category 
    //         }));
        
    //     imageBulkUpdate(imagesToUpdate);
    // };

    // Updated helper function to check if a section is available for a category
    const isSectionAvailableForCategory = (section, category, currentImageStates) => {
        if (!section || !category) return true;
        
        // Convert section to string for consistent comparison
        const targetSection = String(section);
        
        // Check if any OTHER category is using this section
        const conflictingImage = currentImageStates.find(imageState => 
            imageState.category && 
            imageState.category !== category && 
            String(imageState.section) === targetSection
        );
        
        // Debug logging
        if (conflictingImage) {
            console.log(`Section ${targetSection} is already used by category "${conflictingImage.category}"`);
            return false;
        }
        
        return true;
    };

    // Updated section change handler with proper validation
    const handleSectionChange = (imageId, newSection, imageIndex) => {
        const currentImage = imageStates[imageIndex];
        const currentCategory = currentImage.category;
        
        console.log(`Attempting to change section for image ${imageId} to section ${newSection}, category: ${currentCategory}`);
        console.log('Current imageStates:', imageStates);
        
        if (!currentCategory) {
            // If no category is set, just update the section for this image
            const newImageStates = [...imageStates];
            newImageStates[imageIndex].section = newSection;
            setImageStates(newImageStates);
            imageBulkUpdate([{ id: imageId, section: newSection, category: currentCategory }]);
            return;
        }
        
        // Check if the new section is available for this category
        if (!isSectionAvailableForCategory(newSection, currentCategory, imageStates)) {
            alert(`Section ${newSection} is already used by another category. Please choose a different section.`);
            return;
        }
        
        console.log(`Section ${newSection} is available for category ${currentCategory}, proceeding with update`);
        
        // Update all images with the same category to have the same section
        const newImageStates = imageStates.map(imageState => {
            if (imageState.category === currentCategory) {
                return {
                    ...imageState,
                    section: newSection
                };
            }
            return imageState;
        });
        
        setImageStates(newImageStates);
        
        // Bulk update all images with the same category
        const imagesToUpdate = newImageStates
            .filter(imageState => imageState.category === currentCategory)
            .map(imageState => ({ 
                id: imageState.id, 
                section: imageState.section, 
                category: imageState.category 
            }));
        
        imageBulkUpdate(imagesToUpdate);
    };

    // Also update the getNextAvailableSection function to be more accurate
    const getNextAvailableSection = (selectedCategory, currentImageStates, excludeImageId = null) => {
        const maxSections = props?.resultData?.image_count ?? 0;
        
        // Get all sections currently used by other categories (excluding the selected category)
        const usedSections = new Set();
        currentImageStates.forEach(imageState => {
            if (imageState.category && 
                imageState.category !== selectedCategory && 
                imageState.section) {
                usedSections.add(parseInt(imageState.section));
            }
        });
        
        // Find the first available section
        for (let i = 1; i <= maxSections; i++) {
            if (!usedSections.has(i)) {
                return i.toString();
            }
        }
        
        return '1'; // fallback
    };

    
    // Modified category change handler
    const handleCategoryChange = (imageId, newCategory, imageIndex) => {
        if (!newCategory) {
            // If clearing category, just update this image
            const newImageStates = [...imageStates];
            newImageStates[imageIndex].category = newCategory;
            setImageStates(newImageStates);
            imageBulkUpdate([{id: imageId, section: imageStates[imageIndex].section, category: newCategory}]);
            return;
        }
        
        // Check if this category already has a section assigned to other images
        const existingCategorySection = imageStates.find(imageState => 
            imageState.category === newCategory && imageState.id !== imageId
        )?.section;
        
        let assignedSection;
        
        if (existingCategorySection) {
            // Use the existing section for this category
            assignedSection = existingCategorySection;
        } else {
            // Find the next available section for this category
            assignedSection = getNextAvailableSection(newCategory, imageStates, imageId);
        }
        
        // Update all images with the same category (including this one)
        const newImageStates = imageStates.map(imageState => {
            if (imageState.id === imageId) {
                return {
                    ...imageState,
                    category: newCategory,
                    section: assignedSection
                };
            } else if (imageState.category === newCategory) {
                return {
                    ...imageState,
                    section: assignedSection
                };
            }
            return imageState;
        });
        
        setImageStates(newImageStates);
        
        // Bulk update all affected images
        const imagesToUpdate = newImageStates
            .filter(imageState => imageState.category === newCategory)
            .map(imageState => ({ 
                id: imageState.id, 
                section: imageState.section, 
                category: imageState.category 
            }));
        
        imageBulkUpdate(imagesToUpdate);
    };

    
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
                                {detailImages?.filter(image => cropImageList?.includes(image?.id)).map((image, index) => {
                                // {detailImages?.filter(image => image.id === cropId)?.map((image, index) => {
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
                        {/* {detailImages?.filter(image => image.id === cropId).map((image, index) => { */}
                        {detailImages?.filter(image => cropImageList?.includes(image.id)).map((image, index) => {
                            return (
                                <div key={index} className="crop-item">                            
                                    <div className="crop-image-container">
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
                                                src={getImageUrl(image?.url) || "https://placehold.co/600x400?text=Placeholder"}
                                                alt="Crawled Image"
                                                className="crop-image"
                                                onLoad={(e) => onImageLoad(e, image.id)}
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                                crossOrigin="anonymous"
                                            />
                                        </ReactCrop>
                    
                                        {/* Hidden canvas for crop processing - keep single canvas */}
                                        <canvas
                                            ref={canvasRef}
                                            style={{ display: 'none' }}
                                        />
                                        <div className="crop-image-menu">
                                            <span className="crop-menu-icon" onClick={() => {
                                                handleCrop(image.id);
                                            }}>
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
                                            // value={image?.section || ''}
                                            value={imageStates.find(imageState => imageState.id === image.id)?.section || ''}
                                            // onChange={(e) => {
                                            //     // const newImageStates = [...imageStates];
                                            //     // newImageStates[index].section = e.target.value;
                                            //     // setImageStates(newImageStates);
                                            //     // imageBulkUpdate(newImageStates.map((image) => ({ id: image.id, section: image.section, category: image.category })));

                                            //     const newImageStates = imageStates.map(imageState => {
                                            //         if (imageState.id === image.id) {
                                            //             return {
                                            //                 ...imageState,
                                            //                 section: parseInt(e.target.value) // Convert to number if needed
                                            //             };
                                            //         }
                                            //         return imageState;
                                            //     });
                                            //     setImageStates(newImageStates);
                                            //     imageBulkUpdate(newImageStates.map((imageState) => ({ 
                                            //         id: imageState.id, 
                                            //         section: imageState.section, 
                                            //         category: imageState.category 
                                            //     })));
                                            // }}
                                            onChange={(e) => {
                                                const newImageStates = imageStates.map(imageState => {
                                                    if (imageState.id === image.id) {
                                                        // Find the index for the section change handler
                                                        const imageIndex = imageStates.findIndex(img => img.id === image.id);
                                                        handleSectionChange(image.id, e.target.value, imageIndex);
                                                        return; // handleSectionChange will update the state
                                                    }
                                                    return imageState;
                                                });
                                            }}
                                        />
                                        <NativeSelect 
                                            placeholder="Categories"
                                            data={[
                                                {value: "", label: ""}, 
                                                {value: "hook", label: "Hook"},
                                                {value: "promotion", label: "Promotion"}, 
                                                {value: "selling_point", label: "Selling Point"},
                                                {value: "product_option", label: "Product Option"},
                                                {value: "review", label: "Review"},
                                                {value: "qna", label: "QnA"},
                                                {value: "shipping", label: "Shipping"},
                                                {value: "other", label: "Other"}
                                            ]}
                                            className="crop-item-grouping-select"
                                            radius="8px"
                                            // value={image?.category || ''}
                                            value={imageStates.find(imageState => imageState.id === image.id)?.category || ''}
                                            // onChange={(e) => {
                                            //     // const newImageStates = [...imageStates];
                                            //     // newImageStates[index].category = e.target.value;
                                            //     // setImageStates(newImageStates);
                                            //     // imageBulkUpdate(newImageStates.map((image) => ({ id: image.id, section: image.section, category: image.category })));
                                            //     const newImageStates = imageStates.map(imageState => {
                                            //         if (imageState.id === image.id) {
                                            //             return {
                                            //                 ...imageState,
                                            //                 category: e.target.value
                                            //             };
                                            //         }
                                            //         return imageState;
                                            //     });
                                            //     setImageStates(newImageStates);
                                            //     imageBulkUpdate(newImageStates.map((imageState) => ({ 
                                            //         id: imageState.id, 
                                            //         section: imageState.section, 
                                            //         category: imageState.category 
                                            //     })));
                                            // }}

                                            onChange={(e) => {
                                                const imageIndex = imageStates.findIndex(img => img.id === image.id);
                                                handleCategoryChange(image.id, e.target.value, imageIndex);
                                            }}
                                        />
                                    </div>
                                </div>
                            );  
                        })}
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
                                            <SidebarMenu openCropModal={openCropModal} setCropSection={setCropSection} section={image.section} setCropId={setCropId} cropId={image.id} setCropImageList={setCropImageList} setHoveredItem={setHoveredItem} handleImageDelete={handleImageDelete} />                                                               
                                        </div> 
                                        <div className="crawled-item-zoom">
                                            <IconSearch size="1.5rem" onClick={() => {
                                                // setImageModalUrl(image?.url.substring(8));
                                                setImageModalUrl(getImageUrl(image?.url));
                                                openImageModal();
                                                setHoveredItem(null);
                                            }} />
                                        </div>
                                    </>
                                )}
                                <Image 
                                    src={getImageUrl(image?.url) || "https://placehold.co/600x400?text=Placeholder"}
                                    alt="Crawled Image" 
                                    className="crawled-image"
                                    // style={{ minWidth: '300px', minHeight: '472px' }}
                                    fit="contain"
                                />
                                <div className="crawled-item-grouping">
                                    <NativeSelect 
                                        placeholder="Section"
                                        data={sectionOptions}
                                        className="crawled-item-grouping-select"
                                        color="rgba(1, 1, 1, 1)"
                                        radius="8px"
                                        value={imageStates[index]?.section || ''}
                                        onChange={(e) => {
                                            handleSectionChange(image.id, e.target.value, index);
                                        }}
                                    />

                                    <NativeSelect 
                                        placeholder="Categories"
                                        data={[
                                            {value: "", label: ""}, 
                                            {value: "hook", label: "Hook"},
                                            {value: "promotion", label: "Promotion"}, 
                                            {value: "selling_point", label: "Selling Point"},
                                            {value: "product_option", label: "Product Option"},
                                            {value: "review", label: "Review"},
                                            {value: "qna", label: "QnA"},
                                            {value: "shipping", label: "Shipping"},
                                            {value: "other", label: "Other"}
                                        ]}
                                        className="crawled-item-grouping-select"
                                        radius="8px"
                                        value={imageStates[index]?.category || ''}
                                        onChange={(e) => {
                                            handleCategoryChange(image.id, e.target.value, index);
                                        }}
                                    />
                                    {/* <NativeSelect 
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
                                            imageBulkUpdate([{ id: image.id, section: e.target.value, category: imageStates[index].category }]);
                                            // imageBulkUpdate(newImageStates.map((image) => ({ id: image.id, section: image.section, category: image.category })));
                                            // checkGrouping(e.target.value, "section");
                                        }}
                                    />
                                    <NativeSelect 
                                        // variant="filled"                                    
                                        placeholder="Categories"
                                        data={[
                                            {value: "", label: ""}, 
                                            {value: "hook", label: "Hook"},
                                            {value: "promotion", label: "Promotion"}, 
                                            {value: "selling_point", label: "Selling Point"},
                                            {value: "product_option", label: "Product Option"},
                                            {value: "review", label: "Review"},
                                            {value: "qna", label: "QnA"},
                                            {value: "shipping", label: "Shipping"},
                                            {value: "other", label: "Other"}
                                        ]}
                                        className="crawled-item-grouping-select"
                                        radius="8px"
                                        value={imageStates[index]?.category || ''}
                                        onChange={(e) => {
                                            const newImageStates = [...imageStates];
                                            newImageStates[index].category = e.target.value;
                                            setImageStates(newImageStates);
                                            imageBulkUpdate([{id: image.id, section: imageStates[index].section, category: e.target.value}]);
                                            // imageBulkUpdate(newImageStates.map((image) => ({ id: image.id, section: image.section, category: image.category })));
                                            // checkGrouping(e.target.value, "category");
                                            
                                        }}
                                    /> */}
                                </div>
                            </div> 
                        );
                        
                    })}
                </div>
            </div>

        </div>
    );
}