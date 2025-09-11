import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from './_AuthContext';

export default function Login() {
  const router = useRouter();
  const { login, loading, signInWithGoogle, signInWithGithub, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapError = useMemo(() => (err: any) => {
    const code = err?.code as string | undefined;
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return 'Invalid email or password.';
      case 'auth/user-not-found':
        return 'No account found with that email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      default:
        return err?.message || 'Something went wrong. Please try again.';
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/todos');
    }
  }, [user, router]);

  const submit = async () => {
    try {
      setError(null);
      await login(email.trim(), password);
      router.replace('/(tabs)/todos');
    } catch (e: any) {
      setError(mapError(e));
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      router.replace('/(tabs)/todos');
    } catch (e: any) {
      setError(mapError(e));
    }
  };

  const loginWithGithub = async () => {
    try {
      setError(null);
      await signInWithGithub();
      router.replace('/(tabs)/todos');
    } catch (e: any) {
      setError(mapError(e));
    }
  };


  if (user) return null;
  return (
    <View style={styles.container}>
      <MotiView 
        from={{ opacity: 0, translateY: -100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, delay: 100 }}
        style={styles.header}
      >
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 400, damping: 12 }}
        >
          <Text style={styles.title}>Welcome Back!</Text>
        </MotiView>
      </MotiView>
      
      <MotiView 
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 300, damping: 15 }}
        style={styles.form}
      >
        <MotiView
          from={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 600, damping: 15 }}
          style={styles.inputContainer}
        >
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(t) => { setEmail(t); if (error) setError(null); }}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </MotiView>
        
        <MotiView
          from={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'spring', delay: 800, damping: 15 }}
          style={styles.inputContainer}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(t) => { setPassword(t); if (error) setError(null); }}
            style={styles.input}
            secureTextEntry={!showPassword}
            placeholderTextColor="#666"
          />
          <MotiView
            animate={{ scale: showPassword ? 1.1 : 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Pressable 
              onPress={() => setShowPassword(!showPassword)} 
              style={styles.eyeIcon}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
            </Pressable>
          </MotiView>
        </MotiView>
        
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 1000, damping: 12 }}
        >
          <Pressable 
            onPress={submit} 
            style={[styles.button, loading && styles.buttonDisabled]} 
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>
        </MotiView>

  {error ? (
          <MotiView
            from={{ opacity: 0, translateY: -10, scale: 0.8 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0, translateY: -10, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Text style={styles.errorText}>{error}</Text>
          </MotiView>
        ) : null}

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', delay: 1200, damping: 15 }}
          style={styles.socialRow}
        >
          <Pressable 
            onPress={loginWithGoogle} 
            style={styles.socialButton}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialText}>Continue with Google</Text>
          </Pressable>
          <Pressable 
            onPress={loginWithGithub} 
            style={styles.socialButton}
          >
            <Ionicons name="logo-github" size={20} color="#000" />
            <Text style={styles.socialText}>Continue with GitHub</Text>
          </Pressable>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', delay: 1400, duration: 600 }}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <Pressable 
            onPress={() => router.replace('register' as any)}
          >
            <Text style={styles.linkText}>Create Account</Text>
          </Pressable>
        </MotiView>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#764ba2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: '#764ba2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  socialRow: {
    marginTop: 24,
    gap: 12,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  socialText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: '#764ba2',
    fontSize: 16,
    fontWeight: '600',
  },
});
