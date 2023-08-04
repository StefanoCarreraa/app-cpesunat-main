export default <UiState>{
    darkMode: false,
    navbarVariant: 'navbar-dark',
    sidebarSkin: 'sidebar-dark-primary',
    menuSidebarCollapsed: false,
    controlSidebarCollapsed: true
    // screenSize: calculateWindowSize(window.innerWidth)
};

export interface UiState {
    darkMode: boolean;
    menuSidebarCollapsed: boolean;
    controlSidebarCollapsed: boolean;
    navbarVariant: string;
    sidebarSkin: string;
    screenSize: any;
}
