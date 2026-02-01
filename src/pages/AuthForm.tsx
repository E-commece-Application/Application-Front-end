import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'login' | 'signup' | 'reset' | 'resetCode' | 'resetPassword';

export default function AuthForm() {
  const location = useLocation();
  // Set initial mode based on route
  const initialMode = location.pathname === '/signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Get the redirect path from location state, or default to "/"
  const from = (location.state as any)?.from?.pathname || "/";

  // Update mode when route changes
  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  // Password strength validation
  const getPasswordStrength = (pwd: string) => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    
    const strength = Object.values(checks).filter(Boolean).length;
    return { checks, strength };
  };
  
  const passwordStrength = mode === 'signup' ? getPasswordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
          setLoading(false);
          return;
        }
        
        // Validate password strength on frontend
        const strength = getPasswordStrength(password);
        if (strength.strength < 5) {
          setMessage({ 
            type: 'error', 
            text: 'Le mot de passe doit respecter tous les critères de sécurité' 
          });
          setLoading(false);
          return;
        }
        
        await register(email, password);
        setMessage({
          type: 'success',
          text: 'Compte créé avec succès !'
        });
        
        // Optionally redirect or switch to login after 2 seconds
        setTimeout(() => {
          switchMode('login');
        }, 2000);
      } else if (mode === 'login') {
        const user = await login(email, password);
        setMessage({
          type: 'success',
          text: 'Connexion réussie !'
        });
        
        // Redirect after successful login - admin goes to dashboard
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }, 1000);
      } else if (mode === 'reset') {
        const response = await authAPI.forgotPassword({ email });
        setMessage({
          type: 'success',
          text: response.message || 'Un code de réinitialisation a été envoyé à votre adresse'
        });
        
        // Switch to resetCode mode after 2 seconds
        setTimeout(() => {
          setMode('resetCode');
          setMessage(null);
        }, 2000);
      } else if (mode === 'resetCode') {
        const response = await authAPI.checkResetToken({ code: resetCode });
        if (response.success) {
          setMessage({
            type: 'success',
            text: 'Code valide ! Vous pouvez maintenant réinitialiser votre mot de passe'
          });
          
          // Switch to resetPassword mode
          setTimeout(() => {
            setMode('resetPassword');
            setMessage(null);
          }, 2000);
        }
      } else if (mode === 'resetPassword') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
          setLoading(false);
          return;
        }
        
        const response = await authAPI.resetPassword(resetCode, { password, confirmPassword });
        setMessage({
          type: 'success',
          text: response.message || 'Mot de passe réinitialisé avec succès !'
        });
        
        // Switch back to login after 2 seconds
        setTimeout(() => {
          switchMode('login');
        }, 2000);
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Une erreur est survenue'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setResetCode('');
    setMessage(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
          <div className="bg-foreground px-8 py-10 text-background">
            <div className="flex items-center justify-center mb-4">
              <Link to="/" className="bg-background/10 backdrop-blur-sm p-3 rounded-xl hover:bg-background/20 transition-colors">
                <ShoppingBag className="w-8 h-8" />
              </Link>
            </div>
            <Link to="/">
              <h1 className="text-3xl font-bold text-center mb-2 hover:opacity-80 transition-opacity cursor-pointer">PolyShop</h1>
            </Link>
            <p className="text-background/80 text-center text-sm">
              {mode === 'login' && 'Connectez-vous à votre compte'}
              {mode === 'signup' && 'Créez votre compte'}
              {mode === 'reset' && 'Réinitialisez votre mot de passe'}
              {mode === 'resetCode' && 'Entrez le code de réinitialisation'}
              {mode === 'resetPassword' && 'Nouveau mot de passe'}
            </p>
          </div>

          <div className="p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                </div>
              )}

              {mode === 'resetCode' && (
                <div>
                  <label htmlFor="resetCode" className="block text-sm font-medium text-foreground mb-2">
                    Code de réinitialisation (4 chiffres)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="resetCode"
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      required
                      maxLength={4}
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-center text-2xl tracking-widest"
                      placeholder="1234"
                    />
                  </div>
                </div>
              )}

              {(mode === 'login' || mode === 'signup' || mode === 'resetPassword') && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    {mode === 'resetPassword' ? 'Nouveau mot de passe' : 'Mot de passe'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {/* Password Strength Indicator - Only for signup */}
                  {mode === 'signup' && password && (
                    <div className="mt-3 space-y-2">
                      {/* Strength Bar */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const strengthLevel = passwordStrength?.strength || 0;
                          const isActive = level <= strengthLevel;
                          let bgColor = 'bg-muted';
                          if (strengthLevel <= 2) bgColor = 'bg-red-500';
                          else if (strengthLevel <= 3) bgColor = 'bg-yellow-500';
                          else if (strengthLevel <= 4) bgColor = 'bg-blue-500';
                          else bgColor = 'bg-green-500';
                          
                          return (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                isActive ? bgColor : 'bg-muted'
                              }`}
                            />
                          );
                        })}
                      </div>
                      
                      {/* Strength Text */}
                      <div className="text-xs text-muted-foreground">
                        {passwordStrength && passwordStrength.strength === 0 && (
                          <span className="text-red-600 font-medium">Très faible</span>
                        )}
                        {passwordStrength && passwordStrength.strength === 1 && (
                          <span className="text-red-600 font-medium">Faible</span>
                        )}
                        {passwordStrength && passwordStrength.strength === 2 && (
                          <span className="text-yellow-600 font-medium">Moyen</span>
                        )}
                        {passwordStrength && passwordStrength.strength === 3 && (
                          <span className="text-blue-600 font-medium">Fort</span>
                        )}
                        {passwordStrength && passwordStrength.strength === 4 && (
                          <span className="text-green-600 font-medium">Très fort</span>
                        )}
                        {passwordStrength && passwordStrength.strength === 5 && (
                          <span className="text-green-700 font-bold">Excellent</span>
                        )}
                      </div>
                      
                      {/* Requirements List */}
                      <div className="space-y-1 text-xs">
                        <div className={`flex items-center gap-2 ${passwordStrength?.checks.length ? 'text-foreground' : 'text-muted-foreground'}`}>
                          <span className={passwordStrength?.checks.length ? 'text-green-600' : 'text-muted-foreground'}>
                            {passwordStrength?.checks.length ? '✓' : '○'}
                          </span>
                          <span>Au moins 8 caractères</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength?.checks.uppercase ? 'text-foreground' : 'text-muted-foreground'}`}>
                          <span className={passwordStrength?.checks.uppercase ? 'text-green-600' : 'text-muted-foreground'}>
                            {passwordStrength?.checks.uppercase ? '✓' : '○'}
                          </span>
                          <span>Une majuscule</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength?.checks.lowercase ? 'text-foreground' : 'text-muted-foreground'}`}>
                          <span className={passwordStrength?.checks.lowercase ? 'text-green-600' : 'text-muted-foreground'}>
                            {passwordStrength?.checks.lowercase ? '✓' : '○'}
                          </span>
                          <span>Une minuscule</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength?.checks.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                          <span className={passwordStrength?.checks.number ? 'text-green-600' : 'text-muted-foreground'}>
                            {passwordStrength?.checks.number ? '✓' : '○'}
                          </span>
                          <span>Un chiffre</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordStrength?.checks.special ? 'text-foreground' : 'text-muted-foreground'}`}>
                          <span className={passwordStrength?.checks.special ? 'text-green-600' : 'text-muted-foreground'}>
                            {passwordStrength?.checks.special ? '✓' : '○'}
                          </span>
                          <span>Un caractère spécial (!@#$%...)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(mode === 'signup' || mode === 'resetPassword') && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  <>
                    {mode === 'login' && 'Se connecter'}
                    {mode === 'signup' && "S'inscrire"}
                    {mode === 'reset' && 'Envoyer le code'}
                    {mode === 'resetCode' && 'Vérifier le code'}
                    {mode === 'resetPassword' && 'Réinitialiser le mot de passe'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              {mode === 'reset' || mode === 'resetCode' || mode === 'resetPassword' ? (
                <button
                  onClick={() => switchMode('login')}
                  className="flex items-center justify-center w-full text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </button>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  {mode === 'login' ? (
                    <>
                      Pas encore de compte ?{' '}
                      <button
                        onClick={() => switchMode('signup')}
                        className="text-foreground font-semibold hover:underline"
                      >
                        Créer un compte
                      </button>
                    </>
                  ) : (
                    <>
                      Déjà un compte ?{' '}
                      <button
                        onClick={() => switchMode('login')}
                        className="text-foreground font-semibold hover:underline"
                      >
                        Se connecter
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          En continuant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}

