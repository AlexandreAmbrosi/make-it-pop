import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';
import { toast } from '../utils/toast';
import { CheckCircle2, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import logoImage from 'figma:asset/8d97b428e5970dea61a2c0f5fac7bdc8f578db5f.png';
import svgPaths from '../imports/svg-b0b1ja4jvq';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin, onNavigateToHome }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Validation functions
  const isNameValid = (name: string) => {
    return name.trim().length > 0;
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string) => {
    return password.length >= 6;
  };

  const isConfirmPasswordValid = (confirmPassword: string, password: string) => {
    return confirmPassword === password && confirmPassword.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation avant soumission
    if (!nameValid) {
      toast.error('Name required', {
        description: 'Please enter your name',
        duration: 5000,
      });
      return;
    }

    if (!emailValid) {
      toast.error('Invalid email', {
        description: 'Please enter a valid email address',
        duration: 5000,
      });
      return;
    }

    if (!passwordValid) {
      toast.error('Invalid password', {
        description: 'Password must be at least 6 characters long',
        duration: 5000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please make sure both passwords are identical',
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      setSuccess(true);
      
      toast.success('Account created!', {
        description: `Welcome ${name || 'to Make It Pop'}! Redirecting to your dashboard...`,
        duration: 3000,
      });
      
      setTimeout(() => {
        // La redirection sera gérée par AuthContext
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating your account';
      toast.error('Signup failed', {
        description: errorMessage,
        duration: 5000,
      });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const nameValid = isNameValid(name);
  const emailValid = isEmailValid(email);
  const passwordValid = isPasswordValid(password);
  const confirmPasswordValid = isConfirmPasswordValid(confirmPassword, password);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Fond dégradé animé */}
      <div 
        className="absolute rotating-gradient"
        style={{
          width: '200vmax',
          height: '200vmax',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          backgroundImage: "conic-gradient(from 90deg, rgba(116, 95, 244, 1) -5.2885%, rgba(116, 95, 244, 1) 5.2885%, rgba(89, 149, 246, 1) 16.827%, rgba(92, 222, 235, 1) 27.885%, rgba(113, 231, 173, 1) 33.413%, rgba(133, 239, 111, 1) 38.942%, rgba(189, 244, 113, 1) 44.471%, rgba(244, 248, 114, 1) 50%, rgba(241, 207, 97, 1) 55.769%, rgba(238, 165, 79, 1) 61.538%, rgba(238, 127, 84, 1) 67.067%, rgba(238, 89, 89, 1) 72.596%, rgba(238, 94, 126, 1) 75.361%, rgba(238, 99, 163, 1) 78.125%, rgba(237, 108, 237, 1) 83.654%, rgba(177, 102, 241, 1) 89.183%, rgba(116, 95, 244, 1) 94.712%, rgba(116, 95, 244, 1) 105.29%)"
        }}
      />
      {/* Card d'inscription */}
      <div className="absolute inset-[6px]">
        <div className="bg-white rounded-[8px] p-6 shadow-xl h-full flex items-center justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-[446px]">
            {/* Header avec logo et textes */}
            <motion.div 
              className="flex flex-col items-center gap-6 pb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1 
              }}
            >
              <div className="flex justify-center">
                {success ? (
                  <motion.div 
                    className="w-[68px] h-[68px] rounded-[8px] bg-green-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                ) : (
                  <img src={logoImage} alt="Make It Pop" className="h-[68px] w-auto" />
                )}
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-[18px] font-medium text-neutral-950 leading-[16px]">
                  {success ? 'Welcome aboard!' : 'Join the community'}
                </h1>
                <p className="text-[16px] text-[#717182] leading-[24px]">
                  {success 
                    ? 'Your account has been created successfully' 
                    : 'Start your design learning journey today'
                  }
                </p>
              </div>
            </motion.div>

            {/* Contenu du formulaire */}
            <motion.div 
              className="flex flex-col gap-3 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2 
              }}
            >
              {/* Champ Name */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="name" className="text-[14px] font-medium text-neutral-950 leading-[14px]">
                  Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    disabled={loading || success}
                    className="h-[36px] w-full px-3 py-1 pr-10 bg-[#f3f3f5] rounded-[8px] text-[14px] text-neutral-950 placeholder:text-[#717182] placeholder:opacity-40 border-0 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 transition-all"
                  />
                  {nameTouched && name && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {nameValid ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Champ Email */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="email" className="text-[14px] font-medium text-neutral-950 leading-[14px]">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    required
                    disabled={loading || success}
                    className="h-[36px] w-full px-3 py-1 pr-10 bg-[#f3f3f5] rounded-[8px] text-[14px] text-neutral-950 placeholder:text-[#717182] placeholder:opacity-40 border-0 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 transition-all"
                  />
                  {emailTouched && email && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {emailValid ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Champ Password */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="password" className="text-[14px] font-medium text-neutral-950 leading-[14px]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    required
                    disabled={loading || success}
                    className="h-[36px] w-full px-3 py-1 pr-20 bg-[#f3f3f5] rounded-[8px] text-[14px] text-neutral-950 placeholder:text-[#717182] placeholder:opacity-40 border-0 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {passwordTouched && password && (
                      <>
                        {passwordValid ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#717182] hover:text-neutral-950 transition-colors"
                      disabled={loading || success}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Champ Confirm Password */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="confirmPassword" className="text-[14px] font-medium text-neutral-950 leading-[14px]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    required
                    disabled={loading || success}
                    className="h-[36px] w-full px-3 py-1 pr-20 bg-[#f3f3f5] rounded-[8px] text-[14px] text-neutral-950 placeholder:text-[#717182] placeholder:opacity-40 border-0 focus:outline-none focus:ring-2 focus:ring-neutral-950/10 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {confirmPasswordTouched && confirmPassword && (
                      <>
                        {confirmPasswordValid ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#717182] hover:text-neutral-950 transition-colors"
                      disabled={loading || success}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer avec bouton et lien */}
            <motion.div 
              className="flex flex-col items-center gap-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3 
              }}
            >
              {/* Bouton Sign up */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#030213] text-white rounded-[8px] py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#030213]/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[14px] font-medium leading-[20px]">Creating account...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[14px] font-medium leading-[20px]">Account created!</span>
                  </>
                ) : (
                  <>
                    <span className="text-[14px] font-medium leading-[20px]">Sign up for free</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path d={svgPaths.p28e93fc0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d="M10 8H2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      <path d={svgPaths.pc444e40} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    </svg>
                  </>
                )}
              </button>

              {/* Lien vers connexion */}
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] text-[#717182] leading-[20px]">Already have an account ?</span>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  disabled={loading}
                  className="text-[14px] font-medium text-neutral-950 leading-[24px] hover:underline transition-all disabled:opacity-50"
                >
                  Sign in
                </button>
              </div>
            </motion.div>
          </form>
        </div>
      </div>

      {/* Bouton Retour au-dessus de la card */}
      <button
        onClick={onNavigateToHome}
        className="fixed top-6 left-6 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-200 z-10"
        disabled={loading || success}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d={svgPaths.p203476e0} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </svg>
        <span className="text-sm text-[#717182]">Retour</span>
      </button>
    </div>
  );
};
