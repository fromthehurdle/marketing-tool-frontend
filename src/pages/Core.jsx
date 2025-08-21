// import './Core.css';
// import { useState, useEffect } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { Breadcrumbs, Anchor, Avatar, NavLink, TextInput } from '@mantine/core';
// import { 
//   IconHome, 
//   IconBook, 
//   IconChartLine, 
//   IconClock, 
//   IconCoins, 
//   IconSearch, 
//   IconBell,
//   IconFolderFilled,
//   IconFile, 
//   IconFileText, 
//   IconFileFilled, 
//   IconNote, 
//   IconHomeFilled, 
//   IconChartBarPopular, 
//   IconReportAnalytics, 
//   IconHistory, 
// } from '@tabler/icons-react';

// export default function Core(props) {
//     const [opened, setOpened] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation(); // Add this hook
//     const [selectedNav, setSelectedNav] = useState("home"); 
    
//     // Function to get nav value from URL
//     const getNavFromPath = (pathname) => {
//         const pathSegments = pathname.split('/').filter(segment => segment !== '');
        
//         if (pathSegments.length === 0) {
//             return 'home'; // Root path
//         } else if (pathSegments[0] == 'folder') {
//             return 'library';
//         }

//         if (pathSegments.includes('search')) {
//             return 'search';
//         } else if (pathSegments.includes('analysis')) {
//             return 'analysis';
//         } else if (pathSegments.includes('planning')) {
//             return 'planning';
//         } else if (pathSegments.includes('usage')) {
//             return 'usage';
//         } else if (pathSegments.includes('library')) {
//             return 'library';
//         }
        
//         // Return the first segment after the root
//         return pathSegments[0];
//     };

//     // Update selectedNav based on current URL
//     useEffect(() => {
//         const currentNav = getNavFromPath(location.pathname);
//         setSelectedNav(currentNav);
        
//         // Auto-open submenu if current nav is analysis, search, or planning
//         if (['analysis', 'search', 'planning'].includes(currentNav)) {
//             setOpened('Product Analysis');
//         }
//     }, [location.pathname]);

//     const toggleSubmenu = (label) => {
//         setOpened(opened === label ? null : label);
//     };

//     const items = [
//         { title: '라이브러리 관리', href: '/library' },
//         { title: '폴더', href: '/folder' },
//         { title: 'analysis', href: '/analysis' },
//     ].map((item, index) => (
//         <Anchor href={item.href} key={index} className="breadcrumb-item">
//             {item.title}
//         </Anchor>
//     ));

//     return (
//         <div className="core-container">
//             <div className="sidebar">
//                 <div className="logo">
//                     <span>Logo</span>
//                 </div>
//                 <div className="user-profile">
//                     <div className="profile-info">
//                         <div className="profile-image">
//                             <Avatar 
//                                 variant="filled"
//                                 size={40}
//                                 radius={8}
//                                 color="rgba(0,0,0,1)"
//                             >
//                                 <span style={{ color: '#ffffff' }}>J</span>
//                             </Avatar>
//                         </div>
//                         <div className="profile-desc">
//                             <span className="profile-name">John Doe</span>
//                             <span className="profile-plan">Premium</span>                        
//                         </div>
//                     </div>
//                     <div className="profile-action">
//                         <button className="profile-button">맴버 추가</button>
//                     </div>
//                 </div>
//                 <div className="navigation-menu">
//                     <NavLink
//                         label="Home"
//                         leftSection={<IconHomeFilled size="20px" />}
//                         className={selectedNav === "home" ? "nav-link selected" : "nav-link"}
//                         onClick={() => {navigate('/home');}}
//                     />
                    
//                     <NavLink
//                         label="라이브러리 관리"
//                         leftSection={<IconBook size="20px" />}
//                         className={selectedNav === "library" ? "nav-link selected" : "nav-link"}
//                         onClick={() => {navigate('/library');}}
//                     />
                    
//                     <NavLink
//                         label="Product Analysis"
//                         leftSection={<IconReportAnalytics size="20px" />}
//                         rightSection={null}
//                         opened={opened === 'Product Analysis'}
//                         onChange={() => toggleSubmenu('Product Analysis')}
//                         childrenOffset={28}
//                         className="nav-link"
//                     >
//                         <div className="sub-container">
//                             <NavLink 
//                                 label="쇼핑 리서치" 
//                                 className={selectedNav === "search" ? "nav-link selected" : "nav-link"} 
//                                 onClick={() => navigate('/search')}
//                             />
//                             <NavLink 
//                                 label="상세 페이지 분석" 
//                                 className={selectedNav === "analysis" ? "nav-link selected" : "nav-link"} 
//                                 onClick={() => navigate('/analysis')} 
//                             />
//                             <NavLink 
//                                 label="상세 페이지 기획" 
//                                 className={selectedNav === "planning" ? "nav-link selected" : "nav-link"} 
//                                 onClick={() => navigate('/planning')} 
//                             />
//                         </div>
//                     </NavLink>
                    
//                     <NavLink
//                         label="사용량"
//                         leftSection={<IconHistory size="20px" />}
//                         className={selectedNav === "usage" ? "nav-link selected" : "nav-link"}
//                         onClick={() => {navigate('/usage');}}
//                     />
//                 </div>
//                 <div className="tokens">
//                     <div className="tokens-icon">
//                         <IconCoins size="1.5rem" />
//                     </div>
//                     <div className="tokens-content">
//                         <span className="tokens-label">잔여 토큰</span>
//                         <span className="tokens-value">50</span>
//                     </div>
//                 </div>
//             </div>
//             <div className="header">
//                 <div className="header-left">
//                     <TextInput
//                         placeholder="검색"
//                         rightSection={<IconSearch size="20px" />}
//                         className="search-input"
//                         styles={{
//                             input: {
//                                 height: '44px',
//                                 padding: '12px 16px'
//                             }
//                         }}
//                     />
//                 </div>
//                 <div className="header-right">
//                     <span className="header-right-action-item">
//                         <IconBell size="1rem" />
//                     </span>
//                     <span className="header-right-action-item">
//                         토큰 충전
//                     </span>
//                     <span className="header-right-action-item">
//                         사용량 관리
//                     </span>
//                     <span className="header-right-action-item">
//                         메뉴얼
//                     </span>
//                     <span className="header-right-action-item">
//                         엔터프라이즈 문의
//                     </span>
//                 </div>
//             </div>
//             <div className="content">
//                 <div className="content-top">
//                     {props.showNavigation && 
//                         <div className="content-navigation">
//                             <Breadcrumbs separator=">" separatorMargin="md" mt="xs">
//                                 {items}
//                             </Breadcrumbs>
//                         </div>
//                     }
//                     <div className="content-header">
//                         <div className="content-header-header">
//                             {props.showHeaderIcon && 
//                                 (props.icon === "IconFile" ? <IconFileText size="1.5rem" /> :
//                                 props.icon === "IconFolder" ? <IconFolderFilled size="1.5rem" /> :
//                                 null)
//                             }
//                             <h1>{props.headerText}</h1>
//                         </div>
//                         <h2>{props?.subText}</h2>
//                     </div>
//                 </div>
//                 <Outlet />
//             </div>
//         </div>
//     );
// }


import './Core.css';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs, Anchor, Avatar, NavLink, TextInput } from '@mantine/core';
import { 
  IconHome, 
  IconBook, 
  IconChartLine, 
  IconClock, 
  IconCoins, 
  IconSearch, 
  IconBell,
  IconFolderFilled,
  IconFile, 
  IconFileText, 
  IconFileFilled, 
  IconNote, 
  IconHomeFilled, 
  IconChartBarPopular, 
  IconReportAnalytics, 
  IconHistory,
  IconMenu2,
  IconX
} from '@tabler/icons-react';

export default function Core(props) {
    const [opened, setOpened] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true); // New state for sidebar
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedNav, setSelectedNav] = useState("home"); 
    
    // Function to get nav value from URL
    const getNavFromPath = (pathname) => {
        const pathSegments = pathname.split('/').filter(segment => segment !== '');
        
        if (pathSegments.length === 0) {
            // return 'home'; // Root path
            return 'search';
        } else if (pathSegments[0] == 'folder') {
            return 'library';
        }

        if (pathSegments.includes('search')) {
            return 'search';
        } else if (pathSegments.includes('analysis')) {
            return 'analysis';
        } else if (pathSegments.includes('planning')) {
            return 'planning';
        } else if (pathSegments.includes('usage')) {
            return 'usage';
        } else if (pathSegments.includes('library')) {
            return 'library';
        }
        
        // Return the first segment after the root
        return pathSegments[0];
    };

    // Update selectedNav based on current URL
    useEffect(() => {
        const currentNav = getNavFromPath(location.pathname);
        setSelectedNav(currentNav);
        
        // Auto-open submenu if current nav is analysis, search, or planning
        if (['analysis', 'search', 'planning'].includes(currentNav)) {
            setOpened('Product Analysis');
        }
    }, [location.pathname]);

    const toggleSubmenu = (label) => {
        setOpened(opened === label ? null : label);
    };

    // New function to toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const items = [
        { title: '라이브러리 관리', href: '/library' },
        { title: '폴더', href: '/folder' },
        { title: 'analysis', href: '/analysis' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index} className="breadcrumb-item">
            {item.title}
        </Anchor>
    ));

    return (
        <div className={`core-container ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
            {/* Floating toggle button when sidebar is closed */}
            {!sidebarOpen && (
                <button 
                    className="floating-toggle"
                    onClick={toggleSidebar}
                    aria-label="사이드바 열기"
                >
                    <IconMenu2 size="20px" />
                </button>
            )}
            
            {/* Sidebar - only render when open */}
            {sidebarOpen && (
                <div className="sidebar">
                    <button 
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        aria-label="사이드바 닫기"
                    >
                        <IconX size="20px" />
                    </button>
                    
                    <div className="logo">
                        <span>Logo</span>
                    </div>
                    <div className="user-profile">
                        <div className="profile-info">
                            <div className="profile-image">
                                <Avatar 
                                    variant="filled"
                                    size={40}
                                    radius={8}
                                    color="rgba(0,0,0,1)"
                                >
                                    <span style={{ color: '#ffffff' }}>J</span>
                                </Avatar>
                            </div>
                            <div className="profile-desc">
                                <span className="profile-name">John Doe</span>
                                <span className="profile-plan">Premium</span>                        
                            </div>
                        </div>
                        <div className="profile-action">
                            <button className="profile-button">맴버 추가</button>
                        </div>
                    </div>
                    <div className="navigation-menu">
                        <NavLink
                            label="Home"
                            leftSection={<IconHomeFilled size="20px" />}
                            className={selectedNav === "home" ? "nav-link selected" : "nav-link"}
                            onClick={() => {navigate('/home');}}
                        />
                        
                        <NavLink
                            label="라이브러리 관리"
                            leftSection={<IconBook size="20px" />}
                            className={selectedNav === "library" ? "nav-link selected" : "nav-link"}
                            onClick={() => {navigate('/library');}}
                        />
                        
                        <NavLink
                            label="Product Analysis"
                            leftSection={<IconReportAnalytics size="20px" />}
                            rightSection={null}
                            opened={opened === 'Product Analysis'}
                            onChange={() => toggleSubmenu('Product Analysis')}
                            childrenOffset={28}
                            className="nav-link"
                        >
                            <div className="sub-container">
                                <NavLink 
                                    label="쇼핑 리서치" 
                                    className={selectedNav === "search" ? "nav-link selected" : "nav-link"} 
                                    onClick={() => navigate('/search')}
                                />
                                <NavLink 
                                    label="상세 페이지 분석" 
                                    className={selectedNav === "analysis" ? "nav-link selected" : "nav-link"} 
                                    onClick={() => navigate('/analysis')} 
                                />
                                <NavLink 
                                    label="상세 페이지 기획" 
                                    className={selectedNav === "planning" ? "nav-link selected" : "nav-link"} 
                                    onClick={() => navigate('/planning')} 
                                />
                            </div>
                        </NavLink>
                        
                        <NavLink
                            label="사용량"
                            leftSection={<IconHistory size="20px" />}
                            className={selectedNav === "usage" ? "nav-link selected" : "nav-link"}
                            onClick={() => {navigate('/usage');}}
                        />
                    </div>
                    <div className="tokens">
                        <div className="tokens-icon">
                            <IconCoins size="1.5rem" />
                        </div>
                        <div className="tokens-content">
                            <span className="tokens-label">잔여 토큰</span>
                            <span className="tokens-value">50</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="header">
                <div className="header-left">
                    <TextInput
                        placeholder="검색"
                        rightSection={<IconSearch size="20px" />}
                        className="search-input"
                        styles={{
                            input: {
                                height: '44px',
                                padding: '12px 16px'
                            }
                        }}
                    />
                </div>
                <div className="header-right">
                    <span className="header-right-action-item">
                        <IconBell size="1rem" />
                    </span>
                    <span className="header-right-action-item">
                        토큰 충전
                    </span>
                    <span className="header-right-action-item">
                        사용량 관리
                    </span>
                    <span className="header-right-action-item">
                        메뉴얼
                    </span>
                    <span className="header-right-action-item">
                        엔터프라이즈 문의
                    </span>
                </div>
            </div>
            <div className="content">
                <div className="content-top">
                    {props.showNavigation && 
                        <div className="content-navigation">
                            <Breadcrumbs separator=">" separatorMargin="md" mt="xs">
                                {items}
                            </Breadcrumbs>
                        </div>
                    }
                    <div className="content-header">
                        <div className="content-header-header">
                            {props.showHeaderIcon && 
                                (props.icon === "IconFile" ? <IconFileText size="1.5rem" /> :
                                props.icon === "IconFolder" ? <IconFolderFilled size="1.5rem" /> :
                                null)
                            }
                            <h1>{props.headerText}</h1>
                        </div>
                        <h2>{props?.subText}</h2>
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
