PRAGMA foreign_keys = ON;

-- ==========================================
-- ADMINISTRATOR_ACCOUNT
-- ==========================================
CREATE TABLE ADMINISTRATOR_ACCOUNT (
    Administrator_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Administrator_Username VARCHAR(150) NOT NULL UNIQUE,
    Administrator_First_Name VARCHAR(150) NOT NULL,
    Administrator_Last_Name VARCHAR(150) NOT NULL,
    Administrator_Email VARCHAR(254) NOT NULL,
    Administrator_Password_Hash VARCHAR(128) NOT NULL,
    Administrator_Is_Active BOOLEAN NOT NULL DEFAULT 1,
    Administrator_Date_Joined DATETIME NOT NULL,
    Administrator_Last_Login DATETIME
);

-- ==========================================
-- PROPERTY_TYPE
-- ==========================================
CREATE TABLE PROPERTY_TYPE (
    Property_Type_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Property_Type_Name VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================================
-- NEIGHBORHOOD
-- ==========================================
CREATE TABLE NEIGHBORHOOD (
    Neighborhood_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Neighborhood_Name VARCHAR(80) NOT NULL UNIQUE
);

-- ==========================================
-- LISTING_STATUS
-- ==========================================
CREATE TABLE LISTING_STATUS (
    Listing_Status_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Listing_Status_Name VARCHAR(20) NOT NULL UNIQUE
);

-- ==========================================
-- PRICE_RANGE
-- ==========================================
CREATE TABLE PRICE_RANGE (
    Price_Range_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Price_Range_Name VARCHAR(80) NOT NULL,
    Price_Range_Lower_Value DECIMAL(12,2) NOT NULL,
    Price_Range_Upper_Value DECIMAL(12,2) NOT NULL
);

-- ==========================================
-- LISTING
-- ==========================================
CREATE TABLE LISTING (
    Listing_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Listing_Street_Address VARCHAR(120) NOT NULL,
    Listing_City VARCHAR(60) NOT NULL,
    Listing_State VARCHAR(2) NOT NULL,
    Listing_Zip_Code VARCHAR(10) NOT NULL,
    Listing_Price DECIMAL(12,2) NOT NULL,
    Listing_Description TEXT NOT NULL,
    Listing_Bedrooms INTEGER NOT NULL,
    Listing_Bathrooms DECIMAL(3,1) NOT NULL,
    Listing_Garage_Spaces INTEGER NOT NULL,
    Listing_Square_Feet INTEGER NOT NULL,
    Listing_Lot_Size INTEGER NOT NULL,
    Listing_Year_Built INTEGER NOT NULL,
    Listing_Property_Type_ID INTEGER NOT NULL,
    Listing_Neighborhood_ID INTEGER NOT NULL,
    Listing_Price_Range_ID INTEGER NOT NULL,
    Listing_Current_Status_ID INTEGER NOT NULL,
    Listing_Is_Active BOOLEAN NOT NULL DEFAULT 1,
    Listing_Administrator_ID INTEGER NOT NULL,
    Listing_Last_Modified_By_ID INTEGER NOT NULL,
    Listing_Date_Created DATETIME NOT NULL,
    Listing_Date_Updated DATETIME NOT NULL,
    Listing_Date_Sold DATE,
    Listing_Is_Featured BOOLEAN NOT NULL DEFAULT 0,

    FOREIGN KEY (Listing_Property_Type_ID)
        REFERENCES PROPERTY_TYPE(Property_Type_ID),

    FOREIGN KEY (Listing_Neighborhood_ID)
        REFERENCES NEIGHBORHOOD(Neighborhood_ID),

    FOREIGN KEY (Listing_Price_Range_ID)
        REFERENCES PRICE_RANGE(Price_Range_ID),

    FOREIGN KEY (Listing_Current_Status_ID)
        REFERENCES LISTING_STATUS(Listing_Status_ID),

    FOREIGN KEY (Listing_Administrator_ID)
        REFERENCES ADMINISTRATOR_ACCOUNT(Administrator_ID),

    FOREIGN KEY (Listing_Last_Modified_By_ID)
        REFERENCES ADMINISTRATOR_ACCOUNT(Administrator_ID)
);

-- ==========================================
-- LISTING_PHOTO
-- ==========================================
CREATE TABLE LISTING_PHOTO (
    Listing_Photo_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Listing_Photo_Listing_ID INTEGER NOT NULL,
    Listing_Photo_Image_File VARCHAR(255) NOT NULL,
    Listing_Photo_Display_Order INTEGER NOT NULL,
    Listing_Photo_Alternative_Text VARCHAR(150),

    FOREIGN KEY (Listing_Photo_Listing_ID)
        REFERENCES LISTING(Listing_ID)
);

-- ==========================================
-- SEARCH_LOG
-- ==========================================
CREATE TABLE SEARCH_LOG (
    Search_Log_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Search_Log_Date_Time DATETIME NOT NULL,
    Search_Log_Property_Type_ID INTEGER,
    Search_Log_Neighborhood_ID INTEGER,
    Search_Log_Price_Range_ID INTEGER,
    Search_Log_Is_Completed BOOLEAN NOT NULL DEFAULT 0,

    FOREIGN KEY (Search_Log_Property_Type_ID)
        REFERENCES PROPERTY_TYPE(Property_Type_ID),

    FOREIGN KEY (Search_Log_Neighborhood_ID)
        REFERENCES NEIGHBORHOOD(Neighborhood_ID),

    FOREIGN KEY (Search_Log_Price_Range_ID)
        REFERENCES PRICE_RANGE(Price_Range_ID)
);

-- ==========================================
-- AUDIT_LOG
-- ==========================================
CREATE TABLE AUDIT_LOG (
    Audit_Log_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Audit_Log_Administrator_ID INTEGER NOT NULL,
    Audit_Log_Date_Time DATETIME NOT NULL,
    Audit_Log_Action VARCHAR(30) NOT NULL,
    Audit_Log_Entity_Name VARCHAR(40) NOT NULL,
    Audit_Log_Entity_ID INTEGER NOT NULL,
    Audit_Log_Change_Summary TEXT,

    FOREIGN KEY (Audit_Log_Administrator_ID)
        REFERENCES ADMINISTRATOR_ACCOUNT(Administrator_ID)
);

-- ==========================================
-- LOCAL_AREA_CATEGORY
-- ==========================================
CREATE TABLE LOCAL_AREA_CATEGORY (
    Local_Area_Category_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Local_Area_Category_Name VARCHAR(60) NOT NULL UNIQUE
);

-- ==========================================
-- LOCAL_AREA_ENTRY
-- ==========================================
CREATE TABLE LOCAL_AREA_ENTRY (
    Local_Area_Entry_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Local_Area_Entry_Category_ID INTEGER NOT NULL,
    Local_Area_Entry_Title VARCHAR(120) NOT NULL,
    Local_Area_Entry_Description TEXT,
    Local_Area_Entry_Web_Link VARCHAR(255) NOT NULL,
    Local_Area_Entry_Is_Active BOOLEAN NOT NULL DEFAULT 1,
    Local_Area_Entry_Editor_ID INTEGER NOT NULL,
    Local_Area_Entry_Date_Updated DATETIME NOT NULL,

    FOREIGN KEY (Local_Area_Entry_Category_ID)
        REFERENCES LOCAL_AREA_CATEGORY(Local_Area_Category_ID),

    FOREIGN KEY (Local_Area_Entry_Editor_ID)
        REFERENCES ADMINISTRATOR_ACCOUNT(Administrator_ID)
);

-- ==========================================
-- SITE_PROFILE
-- ==========================================
CREATE TABLE SITE_PROFILE (
    Site_Profile_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Site_Profile_Broker_Name VARCHAR(100) NOT NULL,
    Site_Profile_Biography TEXT NOT NULL,
    Site_Profile_Portrait_Image_File VARCHAR(255),
    Site_Profile_Office_Address VARCHAR(200) NOT NULL,
    Site_Profile_Phone VARCHAR(20) NOT NULL,
    Site_Profile_Website VARCHAR(255),
    Site_Profile_Email VARCHAR(254) NOT NULL,
    Site_Profile_Editor_ID INTEGER NOT NULL,
    Site_Profile_Date_Updated DATETIME NOT NULL,

    FOREIGN KEY (Site_Profile_Editor_ID)
        REFERENCES ADMINISTRATOR_ACCOUNT(Administrator_ID)
);