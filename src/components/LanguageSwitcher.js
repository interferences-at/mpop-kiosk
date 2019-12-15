import Button from '@material-ui/core/Button';
import React from 'react';

class LanguageSwitcher extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button color="primary">Français</Button>
        <Button color="secondary">English</Button>
      </div>
    );
  }
}

export default LanguageSwitcher;

