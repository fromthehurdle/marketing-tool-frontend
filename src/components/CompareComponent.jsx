import React from 'react';
import './CompareComponent.css';
import { useState, useEffect } from 'react';
import { Button, Input, NativeSelect, Tabs, SegmentedControl } from '@mantine/core';
import { 
  IconSearch, 
  IconFolderFilled, 
  IconRefresh, 
  IconStarFilled,
  IconStar,
  IconEdit, 
  IconCurrencyWon, 
  IconTruck, 
  IconStars, 
  IconClock, 
  IconPlus,
  IconAB
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';

export default function CompareComponent(props) {
    return (
        <div className="compare-component-container">
            <div className="compare-top">
                <div className="compare-header">
                    <IconStarFilled size="1.5rem" color="#203DE0" />
                    <span className="compare-header-text">{props?.resultData?.product}</span>
                </div>
                <div className="compare-sub-header">
                    <span className="compare-sub-header-text">UUID : {props.resultData?.product_url?.split("/").at(-1)}</span>
                </div>
                <div className="compare-end-header">
                    <IconEdit size="1.5rem" color="#757575" />
                    <span className="compare-end-header-text">메모를 입력하세요</span>
                </div>
            </div>
            <div className="compare-middle">
                <div className="compare-item">
                    <IconCurrencyWon size="1.5rem" color="#000" className="compare-item-icon" />
                    <div className="compare-item-info">
                        <span className="compare-item-title">Sale Price</span>
                        <span className="compare-item-subtitle">₩{props?.resultData?.sale_price || 0}</span>
                    </div>
                </div>
                <div className="compare-item">
                    <IconTruck size="1.5rem" color="#000" className="compare-item-icon" />
                    <div className="compare-item-info">
                        <span className="compare-item-title">Shipping</span>
                        <span className="compare-item-subtitle">₩{props?.resultData?.shipping || 0}</span>
                    </div>
                </div>
                <div className="compare-item">
                    <IconStars size="1.5rem" color="#000" className="compare-item-icon" />
                    <div className="compare-item-info">
                        <span className="compare-item-title">Review</span>
                        <span className="compare-item-subtitle">{props?.resultData?.review_count || 0}</span>
                    </div>
                </div>
                <div className="compare-item">
                    <IconClock size="1.5rem" color="#000" className="compare-item-icon" />
                    <div className="compare-item-info">
                        <span className="compare-item-title">Last Update</span>
                        <span className="compare-item-subtitle">{props?.resultData?.product_date?.split("T")[0]}</span>
                    </div>
                </div>
                <div className="compare-item">
                    <IconPlus size="1.5rem" color="#000" className="compare-item-icon" />
                    <div className="compare-item-info">
                        <span className="compare-item-subtitle" style={{opacity: 0}}>추가하기</span>
                        <span className="compare-item-title-2">데이터 추가하기</span>
                    </div>
                </div>
            </div>
            <div className="compare-bottom">
                <Button
                    leftSection={<IconEdit size="1.5rem" />}
                    className="compare-edit-button"
                >
                    수정하기
                </Button>
                <Button
                    leftSection={<IconAB size="1.5rem" />}
                    variant="filled"
                    color="rgba(0,0,0,1)"
                    className="compare-compare-button"
                >
                    상품 비교하기
                </Button>
            </div>
        </div>
    ); 
}