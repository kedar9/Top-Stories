import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
const constants = require('./../../../constants.js');

import BoxChoice from './../BoxChoice/index.jsx';
import Categories from './../Categories/index.jsx';
import Countries from './../Countries/index.jsx';

import './styles.scss';

const SideBar = (props) => {
  const [countryPanel, setCountryPanel] = useState(false);
  const [categoryPanel, setCategoryPanel] = useState(false);
  const { selectedCountry, selectedCategory } = props;
  const selectedCountryName = constants.COUNTRIES[selectedCountry] ||
    'Select Region';
  const selectedCategoryObj = constants.CATEGORIES[selectedCategory] ||
    constants.CATEGORIES[constants.GENERAL_CATEGORY];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <a href="/" className="sidebar-title">
          <BoxChoice
            icon="News"
            title="TopStories"
            dimension={5}
            backgroundColor="#c00000"
            iconColor="#ffffff"
          />
        </a>
        <div className="sidebar-search clear">
          <SearchBox
            placeholder="Search"
            onSearch={value => window.location.href = `/search/${value.toLowerCase().replace(/ /g, '-')}`}
            underlined={true}
            value={props.searchQ}
          />
        </div>
      </div>
      <div className="sidebar-options">
        {!props.searchQ && <div className="sidebar-region clear" onClick={() => setCountryPanel(true)}>
          <BoxChoice
            icon="Globe"
            title={selectedCountryName}
            backgroundColor="#999999"
          />
        </div>}
        {selectedCategory && <div
          className="sidebar-categories clear ms-hiddenXlUp"
          onClick={() => setCategoryPanel(true)}
        >
          <BoxChoice
            icon={selectedCategoryObj.icon}
            title={selectedCategory}
            backgroundColor="#999999"
          />
        </div>}
        <div className="sidebar-categories ms-hiddenLgDown">
          <Categories
            selected={selectedCategory}
            selectedCountry={selectedCountry}
          />
        </div>
      </div>
      <Panel
        className="sidebar-region-panel"
        isOpen={countryPanel}
        onDismiss={() => setCountryPanel(false)}
        onOuterClick={() => setCountryPanel(false)}
        isLightDismiss={true}
        type={PanelType.smallFixedNear}
        headerText="Change Region"
        isHiddenOnDismiss={true}
      >
        <Countries
          selected={selectedCountry}
          selectedCategory={selectedCategory}
        />
      </Panel>
      <Panel
        className="sidebar-category-panel hiddenXlUp"
        isOpen={categoryPanel}
        onDismiss={() => setCategoryPanel(false)}
        onOuterClick={() => setCategoryPanel(false)}
        isLightDismiss={true}
        type={PanelType.smallFixedNear}
        headerText="Select Category"
        isHiddenOnDismiss={true}
      >
        <Categories
          selected={selectedCategory}
          selectedCountry={selectedCountry}
        />
      </Panel>
    </div>
  );
};

SideBar.defaultProps = {
  searchQ: ''
}

export default SideBar;
