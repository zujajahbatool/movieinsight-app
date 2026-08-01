import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useNavigationStore } from '../store/useNavigationStore';
import Button from '../components/common/Button/Button';

// Assets
import loginSignupImg from '../assets/signup-and-login/login-signup.png';
import userSuccessImg from '../assets/signup-and-login/user.png';
import signupAvatar1 from '../assets/signup-and-login/signup-avatar-1.png';
import signupAvatar2 from '../assets/signup-and-login/signup-avatar-2.png';

// Avatars
import avatar1 from '../assets/profile-avatars/avatar-1.png';
import avatar2 from '../assets/profile-avatars/avatar-2.png';
import avatar3 from '../assets/profile-avatars/avatar-3.png';
import avatar4 from '../assets/profile-avatars/avatar-4.png';
import avatar5 from '../assets/profile-avatars/avatar-5.png';
import avatar6 from '../assets/profile-avatars/avatar-6.png';
import avatar7 from '../assets/profile-avatars/avatar-7.png';
import avatar8 from '../assets/profile-avatars/avatar-8.png';
import avatar9 from '../assets/profile-avatars/avatar-9.png';
import avatar10 from '../assets/profile-avatars/avatar-10.png';

import styles from './LoginPage.module.css';

const AVATAR_LIST = [
  { id: 1, src: avatar1, name: 'Deadpool' },
  { id: 2, src: avatar2, name: 'Joker' },
  { id: 3, src: avatar3, name: 'Spider-Man' },
  { id: 4, src: avatar4, name: 'Batman' },
  { id: 5, src: avatar5, name: 'Ant-Man' },
  { id: 6, src: avatar6, name: 'Anxiety' },
  { id: 7, src: avatar7, name: 'Moana' },
  { id: 8, src: avatar8, name: 'Garfield' },
  { id: 9, src: avatar9, name: 'Sonic' },
  { id: 10, src: avatar10, name: 'Upload Custom' },
];

// LocalStorage mock database helpers
const getRegisteredUsers = () => {
  const users = localStorage.getItem('registered_users');
  if (!users) {
    // Seed initial users so login works out of the box
    const initialUsers = [
      { username: 'Zahra_v', password: 'password', fullName: 'Zahra V', avatar: null },
      { username: 'zahra_1244', password: '12488578', fullName: 'zahra vadipoor', avatar: null }
    ];
    localStorage.setItem('registered_users', JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(users);
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return [];
  }
};

const registerUser = (username, password, fullName, avatar) => {
  const users = getRegisteredUsers();
  // Check if user already exists, update details, or add new
  const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (index !== -1) {
    users[index] = { username, password, fullName, avatar };
  } else {
    users.push({ username, password, fullName, avatar });
  }
  localStorage.setItem('registered_users', JSON.stringify(users));
};

function LoginPage() {
  const { previousPage, setPage } = useNavigationStore();
  const fileInputRef = useRef(null);

  // General Tab State: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState('login');

  // Login States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  // Signup States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  
  // Show/Hide Toggles for Signup Passwords
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [signupError, setSignupError] = useState('');
  
  // Signup Stages: 'form' | 'avatar' | 'success'
  const [signupStage, setSignupStage] = useState('form');
  const [selectedAvatar, setSelectedAvatar] = useState(null); // stores selected image source
  const [customAvatarUrl, setCustomAvatarUrl] = useState(null); // stores user uploaded image URL

  // Auto-redirect to home on Login success
  useEffect(() => {
    if (isLoginSuccess) {
      const timer = setTimeout(() => {
        setPage('home');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoginSuccess, setPage]);

  // Auto-redirect to home on Signup success
  useEffect(() => {
    if (signupStage === 'success') {
      const timer = setTimeout(() => {
        setPage('home');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [signupStage, setPage]);

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      setLoginError('Please enter your username');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password');
      return;
    }

    const users = getRegisteredUsers();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (!matchedUser) {
      setLoginError("User doesn't exist");
      return;
    }

    if (matchedUser.password !== loginPassword) {
      setLoginError('Incorrect password');
      return;
    }

    setLoginError('');
    setIsLoginSuccess(true);
  };

  // Handle Signup Stage 1 form validation
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSignupError('FullName is required');
      return;
    }
    if (!email.trim()) {
      setSignupError('Email is required');
      return;
    }
    if (!signupPassword.trim()) {
      setSignupError('password is required');
      return;
    }
    if (!repeatPassword.trim()) {
      setSignupError('repeat the password is required');
      return;
    }
    if (!signupUsername.trim()) {
      setSignupError('UserName is required');
      return;
    }
    if (signupPassword !== repeatPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    const users = getRegisteredUsers();
    const userExists = users.some(
      (u) => u.username.toLowerCase() === signupUsername.trim().toLowerCase()
    );
    if (userExists) {
      setSignupError('Username already exists');
      return;
    }

    setSignupError('');
    setSignupStage('avatar');
  };

  // Confirm selected avatar (Stage 2 to 3)
  const handleAvatarConfirm = () => {
    registerUser(signupUsername.trim(), signupPassword, fullName.trim(), selectedAvatar);
    setSignupStage('success');
  };

  // Custom File Avatar Upload Handler
  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatarUrl(reader.result);
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Triggers input file pick dialog
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleBack = () => {
    if (activeTab === 'signup' && signupStage === 'avatar') {
      // Go back to signup form
      setSignupStage('form');
    } else {
      // Go back to the previous page
      setPage(previousPage || 'home');
    }
  };

  // SUCCESS SCREEN (LOGIN SUCCESS)
  if (isLoginSuccess) {
    const users = getRegisteredUsers();
    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === loginUsername.trim().toLowerCase()
    );
    const userAvatar = matchedUser?.avatar || userSuccessImg;

    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.avatarWrapper}>
            <img src={userAvatar} alt="User Avatar" className={styles.successAvatar} />
          </div>
          <h2 className={styles.successUsername}>{matchedUser?.username || loginUsername}</h2>
          <p className={styles.successMessage}>You've successfully logged in</p>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN (SIGNUP SUCCESS - STAGE 3)
  if (activeTab === 'signup' && signupStage === 'success') {
    return (
      <div className={styles.signupSuccessPage}>
        {/* Background characters */}
        <img
          src={signupAvatar1}
          alt="Deadpool"
          className={[styles.characterImg, styles.charLeft].join(' ')}
        />
        <img
          src={signupAvatar2}
          alt="Na'vi"
          className={[styles.characterImg, styles.charRight].join(' ')}
        />

        <div className={styles.successCard}>
          <div className={styles.avatarWrapper}>
            <img
              src={selectedAvatar || userSuccessImg}
              alt="Selected Profile Avatar"
              className={styles.successAvatar}
            />
          </div>
          <h2 className={styles.successUsername}>{signupUsername}</h2>
          <p className={styles.successMessage}>Your account has been successfully created!</p>
        </div>
      </div>
    );
  }

  // AVATAR SELECTION SCREEN (SIGNUP - STAGE 2)
  if (activeTab === 'signup' && signupStage === 'avatar') {
    return (
      <div className={styles.pageContainer}>
        <Button
          type="button"
          variant="unstyled"
          size="none"
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Go back to form"
        >
          <ArrowLeft size={24} />
        </Button>

        <div className={styles.avatarSelectionContainer}>
          <h1 className={styles.avatarWelcome}>Hi {signupUsername}</h1>

          {/* Top Preview Circle */}
          <div className={styles.avatarWrapperLarge}>
            <img
              src={selectedAvatar || userSuccessImg}
              alt="Profile Preview"
              className={styles.avatarPreview}
            />
          </div>

          <h2 className={styles.avatarSubheading}>choose your profile</h2>

          {/* Hidden File input for custom upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomAvatarUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Avatars Grid */}
          <div className={styles.avatarsGrid}>
            {AVATAR_LIST.map((avatar) => {
              const isUploadPlaceholder = avatar.id === 10;
              const avatarSrc = isUploadPlaceholder && customAvatarUrl ? customAvatarUrl : avatar.src;
              const isSelected = selectedAvatar === avatarSrc;

              return (
                <Button
                  key={avatar.id}
                  type="button"
                  variant="unstyled"
                  size="none"
                  onClick={() => {
                    if (isUploadPlaceholder) {
                      triggerFileSelect();
                    } else {
                      setSelectedAvatar(avatar.src);
                    }
                  }}
                  className={[
                    styles.avatarGridItem,
                    isSelected ? styles.avatarGridItemActive : '',
                  ].join(' ')}
                >
                  <img
                    src={avatarSrc}
                    alt={avatar.name}
                    className={styles.avatarGridImg}
                  />
                </Button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="primary"
            className={styles.confirmBtn}
            onClick={handleAvatarConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: LOGIN / SIGNUP stage 1 (FORM INPUTS)
  return (
    <div className={styles.pageContainer}>
      <Button
        type="button"
        variant="unstyled"
        size="none"
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </Button>

      <div className={styles.loginCard}>
        {/* Left Side: Auth Form */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h1 className={styles.heading}>Welcome</h1>
          </div>

          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <Button
                type="button"
                variant="unstyled"
                size="none"
                className={[
                  styles.tabButton,
                  activeTab === 'login' ? styles.tabButtonActive : '',
                ].join(' ')}
                onClick={() => {
                  setActiveTab('login');
                  setSignupError('');
                  setLoginError('');
                }}
              >
                LOGIN
                {activeTab === 'login' && <span className={styles.tabIndicator} />}
              </Button>
              <Button
                type="button"
                variant="unstyled"
                size="none"
                className={[
                  styles.tabButton,
                  activeTab === 'signup' ? styles.tabButtonActive : '',
                ].join(' ')}
                onClick={() => {
                  setActiveTab('signup');
                  setSignupError('');
                  setLoginError('');
                }}
              >
                SIGNUP
                {activeTab === 'signup' && <span className={styles.tabIndicator} />}
              </Button>
            </div>
          </div>

          {activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className={styles.form}>
              {loginError && <div className={styles.errorMsg}>{loginError}</div>}

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="user"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className={styles.inputField}
                  />
                  <User className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={styles.inputField}
                  />
                  <Button
                    type="button"
                    variant="unstyled"
                    size="none"
                    className={styles.passwordToggle}
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <Eye size={18} className={styles.eyeIcon} />
                    ) : (
                      <EyeOff size={18} className={styles.eyeIcon} />
                    )}
                  </Button>
                </div>
              </div>

              <div className={styles.forgotPasswordContainer}>
                <Button
                  type="button"
                  variant="unstyled"
                  size="none"
                  className={styles.forgotPasswordLink}
                  onClick={() => alert('Reset password feature is coming soon!')}
                >
                  Forgot Password?
                </Button>
              </div>

              <div className={styles.submitContainer}>
                <Button type="submit" variant="primary" className={styles.loginBtn}>
                  LOGIN
                </Button>
              </div>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className={styles.form}>
              {signupError && <div className={styles.errorMsg}>{signupError}</div>}

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="FullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    placeholder="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className={styles.inputField}
                  />
                  <Button
                    type="button"
                    variant="unstyled"
                    size="none"
                    className={styles.passwordToggle}
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPassword ? (
                      <Eye size={18} className={styles.eyeIcon} />
                    ) : (
                      <EyeOff size={18} className={styles.eyeIcon} />
                    )}
                  </Button>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showRepeatPassword ? 'text' : 'password'}
                    placeholder="repeat the password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className={styles.inputField}
                  />
                  <Button
                    type="button"
                    variant="unstyled"
                    size="none"
                    className={styles.passwordToggle}
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    aria-label={showRepeatPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRepeatPassword ? (
                      <Eye size={18} className={styles.eyeIcon} />
                    ) : (
                      <EyeOff size={18} className={styles.eyeIcon} />
                    )}
                  </Button>
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="UserName"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className={styles.inputField}
                  />
                  <User className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.submitContainer}>
                <Button type="submit" variant="primary" className={styles.loginBtn}>
                  Confirm
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Showcase Image */}
        <div className={styles.imageSection}>
          <img src={loginSignupImg} alt="Login Banner" className={styles.showcaseImg} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
