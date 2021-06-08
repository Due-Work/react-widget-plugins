/* eslint-disable no-console */
/* eslint-disable no-undef */
/**
 * @author Robins Gupta
 * @email robinskumar73@gmail.com
 * @create date 2020-07-23 03:39:36
 * @modify date 2020-07-23 03:39:36
 * @desc [description]
 */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';

const URL = `https://www.due.work/app/widgets/snippet.js`;

let isScriptLoaded;

const UseCaseScript = async (
  src,
  widgetType,
  workspaceId,
  userId,
  email,
  firstName,
  lastName,
  profileUrl,
  callback
) => {
  if (!isScriptLoaded && typeof window !== 'undefined' && !window.isIframe) {
    isScriptLoaded = true;
    const script = document.createElement('script');
    script.src = src;
    script.setAttribute('data-workspaceId', workspaceId);
    script.setAttribute('data-widgetType', widgetType);
    if (userId) {
      script.setAttribute('data-userId', userId);
    }

    if (email) {
      script.setAttribute('data-email', email);
    }

    if (firstName) {
      script.setAttribute('data-firstName', firstName);
    }

    if (lastName) {
      script.setAttribute('data-lastName', lastName);
    }

    if (profileUrl) {
      script.setAttribute('data-profileUrl', profileUrl);
    }

    script.addEventListener('load', function() {
      callback();
    });
    script.addEventListener('error', function(error) {
      callback(error);
    });
    document.body.appendChild(script);
  }
};

class UseCasePopup extends PureComponent {
  static propTypes = {
    onLoad: PropTypes.func,
    widgetType: PropTypes.string,
    workspaceId: PropTypes.string.isRequired,
    url: PropTypes.string,
    userId: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    profileUrl: PropTypes.string,
    hide: PropTypes.bool,
    open: PropTypes.bool,
    theme: PropTypes.oneOf(['yellow', 'dark', 'white'])
  };

  static defaultProps = {
    onLoad: null,
    widgetType: 'popup',
    url: URL,
    userId: '',
    email: '',
    firstName: '',
    lastName: '',
    profileUrl: '',
    hide: false,
    open: false,
    theme: undefined
  };

  componentDidUpdate = ({
    hide: oldHide,
    open: oldOpen,
    workspaceId: oldWorkspaceId,
    theme: oldTheme
  }) => {
    const { hide, open, workspaceId, theme } = this.props;
    if (hide !== oldHide) {
      if (hide) {
        this.hide();
      } else {
        this.show();
      }
    }

    if (open !== oldOpen) {
      if (open) {
        this.open();
      } else {
        this.close();
      }
    }

    if (workspaceId !== oldWorkspaceId) {
      this.init(workspaceId);
    }

    if (oldTheme !== theme) {
      this.setTheme(theme);
    }
  };

  loadPopup = () => {
    const { onLoad, hide, open, widgetType, theme } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      if (onLoad) {
        onLoad();
      }

      if (open) {
        this.open();
      }

      if (hide) {
        this.hide();
      }

      if (theme) {
        this.setTheme(theme);
      }
    }
  };

  close = () => {
    const { widgetType } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      window.dueWork[widgetType].close();
    }
  };

  init = () => {
    const { widgetType, workspaceId } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      window.dueWork[widgetType].init(workspaceId);
    }
  };

  open = () => {
    const { widgetType } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      window.dueWork[widgetType].open();
    }
  };

  show = () => {
    const { widgetType } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      window.dueWork[widgetType].show();
    }
  };

  hide = () => {
    const { widgetType } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      window.dueWork[widgetType].hide();
    }
  };

  setTheme = () => {
    const { widgetType, theme } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      window.dueWork[widgetType].setTheme(theme);
    }
  };

  identify = () => {
    const {
      userId,
      email,
      firstName,
      lastName,
      profileUrl,
      widgetType
    } = this.props;
    if (typeof window !== 'undefined' && window.dueWork) {
      if (userId && window.dueWork[widgetType]) {
        window.dueWork[widgetType].identify(userId, {
          email,
          firstName,
          lastName,
          profileUrl
        });
      }
    }
  };

  loadScript = async () => {
    const {
      url,
      widgetType,
      workspaceId,
      userId,
      email,
      firstName,
      lastName,
      profileUrl
    } = this.props;
    if (!workspaceId) {
      console.error(
        'workspaceId is required. Check out https://help.due.work for more info'
      );
    } else {
      await UseCaseScript(
        url,
        widgetType,
        workspaceId,
        userId,
        email,
        firstName,
        lastName,
        profileUrl,
        this.loadPopup
      );
    }
  };

  render() {
    if (!isScriptLoaded && typeof window !== 'undefined' && !window.dueWork) {
      this.loadScript();
    }

    return null;
  }
}

export default UseCasePopup;
