// components/LoginModal.js (or components/LoginModal.tsx)

import { useState } from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { initialLoginError, initialLoginSuccess } from '@/utils/initial'

// Define PropTypes for the component
interface LoginModalProps {
  visible: boolean; // Prop 'visible' is expected to be a boolean
  onClose: () => void; // Prop 'onClose' is expected to be a function that returns void
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>(initialLoginSuccess);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_WEBSITEGATE) {
      setAlert(initialLoginSuccess)
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
        localStorage.setItem('accessACPN', 'true')
        onClose();
      }, 1000);
    } else {
      setAlert(initialLoginError)
      setShowAlert(true)
      setTimeout(() => {
        localStorage.setItem('accessACPN', 'false')
        setShowAlert(false)
      }, 3000);
    }
  };

  return (
    <Modal
      title="Password"
      visible={visible}
      footer={[
        <Button key="login" type="primary" onClick={handleLogin}>
          Login
        </Button>,
      ]}
      rootClassName='atnd-modal'
    >
      <Form layout="vertical">
        <Input.Password className='antd-login' value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form>
      {showAlert && <><br></br> <Alert className={alert.className} message={alert.message} type={alert.type} showIcon /></>}
    </Modal>
  );
};

export default LoginModal;
