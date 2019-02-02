import React from 'react';
import ReactDOM from 'react-dom';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

import BoxChoice from './../BoxChoice/index.jsx';

import './styles.scss';

const Header = (props) => {
  return (
    <header className="header ms-Grid ms-hiddenXlUp">
      <div className="header-container ms-Grid-row">
        <div className="header-title ms-Grid-col ms-sm12 ms-lg9">
          <a href="/">
            <BoxChoice
              icon="News"
              title="TopStories"
              dimension={5}
              backgroundColor="#c00000"
              color="#ffffff"
            />
          </a>
        </div>
        <div className="header-search ms-Grid-col ms-sm12 ms-lg3">
          <SearchBox
            placeholder="Search"
            onFocus={() => console.log('onFocus called')}
            onBlur={() => console.log('onBlur called')}
            underlined={true}
          />
        </div>
      </div>
    </header>
  );
};

Header.defaultProps = {}

export default Header;
