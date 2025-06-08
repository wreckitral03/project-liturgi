import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { COLORS } from '@/utils/theme';

// Add age category enum
export enum AgeCategory {
  TEEN_YOUTH = 'TEEN_YOUTH',
  YOUNG_ADULT = 'YOUNG_ADULT', 
  ADULT = 'ADULT',
  SENIOR = 'SENIOR'
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ageCategory, setAgeCategory] = useState<AgeCategory | null>(null); // Add this
  const [error, setError] = useState('');
  
  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }
    
    if (!email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }
    
    if (!password.trim()) {
      setError('Password tidak boleh kosong');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }
    
    setError('');
    
    try {
      await register(name, email, password, ageCategory); // Add ageCategory parameter
      router.replace('/(tabs)');
    } catch (err) {
      setError('Gagal membuat akun. Silahkan coba lagi.');
    }
  };
  
  const navigateToLogin = () => {
    router.push('/auth/login');
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Buat Akun</Text>
          <Text style={styles.subtitle}>
            Daftar untuk mengakses fitur lengkap Liturgi
          </Text>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama kamu"
              placeholderTextColor="#9E9E9E"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email kamu"
              placeholderTextColor="#9E9E9E"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#9E9E9E"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan ulang password"
              placeholderTextColor="#9E9E9E"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          
          {/* Add age category selection UI after the confirm password field */}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori Usia</Text>
            <View style={styles.ageCategoryContainer}>
              {Object.values(AgeCategory).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.ageCategoryButton,
                    ageCategory === category && styles.ageCategoryButtonSelected
                  ]}
                  onPress={() => setAgeCategory(category)}
                >
                  <Text style={[
                    styles.ageCategoryText,
                    ageCategory === category && styles.ageCategoryTextSelected
                  ]}>
                    {getAgeCategoryLabel(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Daftar</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Sudah memiliki akun? 
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Add helper function
const getAgeCategoryLabel = (category: AgeCategory): string => {
  switch (category) {
    case AgeCategory.TEEN_YOUTH:
      return 'Remaja (13-17 tahun)';
    case AgeCategory.YOUNG_ADULT:
      return 'Dewasa Muda (18-35 tahun)';
    case AgeCategory.ADULT:
      return 'Dewasa (36-59 tahun)';
    case AgeCategory.SENIOR:
      return 'Senior (60+ tahun)';
    default:
      return category;
  }
};

// Add styles for age category selection
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: COLORS.textMain,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textMain,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMain,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textMuted,
  },
  loginLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.error,
  },
  ageCategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  ageCategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  ageCategoryButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ageCategoryText: {
    fontSize: 12,
    color: '#666',
  },
  ageCategoryTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
});