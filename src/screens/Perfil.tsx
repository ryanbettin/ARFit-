// src/screens/Perfil.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { apiClient, api, setAuthToken } from '../api/apiConfig';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 24;
const STAT_CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - 24) / 3;

interface Usuario {
  nome: string;
  email: string;
  xp: number;
  nivel: number;
}

export default function Perfil({ navigation }: any) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const levelUpOpacity = useRef(new Animated.Value(0)).current;

  const [totalExercises, setTotalExercises] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [totalMetasDone, setTotalMetasDone] = useState(0);

  // 🔹 Funções de XP e progressão
  const calcularXpParaNivel = (nivel: number): number => {
    return 100 + (nivel - 1) * 25;
  };

  const calcularXpTotalAteNivel = (nivel: number): number => {
    let total = 0;
    for (let i = 1; i < nivel; i++) {
      total += calcularXpParaNivel(i);
    }
    return total;
  };

  const getNivelPorXp = (xp: number): { nivel: number; xpProximoNivel: number; xpAtualNivel: number } => {
    let nivel = 1;
    let xpAcumulado = 0;
    let xpProximoNivel = calcularXpParaNivel(nivel);

    while (xp >= xpAcumulado + xpProximoNivel) {
      xpAcumulado += xpProximoNivel;
      nivel++;
      xpProximoNivel = calcularXpParaNivel(nivel);
    }

    const xpAtualNivel = xp - xpAcumulado;
    return { nivel, xpProximoNivel, xpAtualNivel };
  };

  const animateLevelUp = () => {
    setShowLevelUp(true);
    Animated.sequence([
      Animated.timing(levelUpOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(levelUpOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => setShowLevelUp(false));
  };

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');
      setAuthToken(token);

      const [uRes, hRes, mRes] = await Promise.all([
        apiClient.get<Usuario>(api.usuario),
        apiClient.get(api.historico),
        apiClient.get(api.metas),
      ]);

      const oldLevel = usuario?.nivel ?? 1;

      // 🔹 Calcula o nível real com base no XP total
      const { nivel, xpProximoNivel, xpAtualNivel } = getNivelPorXp(uRes.data.xp);

      if (nivel > oldLevel) animateLevelUp();

      // Atualiza o usuário com o nível corrigido
      setUsuario({ ...uRes.data, nivel });

      const history = hRes.data;
      setTotalExercises(history.length);
      setTotalReps(history.reduce((sum: number, h: any) => sum + (h.performedReps || 0), 0));

      const metas = mRes.data;
      const doneCount = metas.filter((meta: any) =>
        meta.exercicios.every((me: any) => {
          const sinceTs = new Date(meta.createdAt).getTime();
          return history.some((h: any) =>
            h.exercicioId === me.exercicio.id &&
            new Date(h.data).getTime() >= sinceTs &&
            h.performedSeries >= me.targetSeries &&
            h.performedReps >= me.targetReps
          );
        })
      ).length;
      setTotalMetasDone(doneCount);

    } catch (err: any) {
      console.error('Perfil error:', err);
      Alert.alert('Erro', 'Não foi possível carregar o perfil.');
    } finally {
      setLoading(false);
    }
  }, [usuario?.nivel]);

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'usuarioId']);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      console.error('Logout error:', err);
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0776A0" />
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text style={styles.errorText}>Dados de usuário indisponíveis.</Text>
      </SafeAreaView>
    );
  }

  const { xpProximoNivel, xpAtualNivel } = getNivelPorXp(usuario.xp);
  const progresso = (xpAtualNivel / xpProximoNivel) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color="#fff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{usuario.nome}</Text>
            <Text style={styles.userEmail}>{usuario.email}</Text>
          </View>
        </View>

        {/* XP e Nível */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>
            Nível {usuario.nivel}
          </Text>
          <View style={{ height: 10, backgroundColor: '#ddd', borderRadius: 5, marginTop: 8 }}>
            <View
              style={{
                width: `${progresso}%`,
                backgroundColor: '#f8cb0e',
                height: '100%',
                borderRadius: 5,
              }}
            />
          </View>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
            {xpAtualNivel} / {xpProximoNivel} XP
          </Text>
        </View>

        {/* Animação de Level Up */}
        {showLevelUp && (
          <Animated.View style={[styles.levelUpBox, { opacity: levelUpOpacity }]}>
            <Ionicons name="rocket-outline" size={36} color="#fff" />
            <Text style={styles.levelUpText}>Subiu de Nível!</Text>
          </Animated.View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="barbell" size={24} color="#0776A0" />
            <Text style={styles.statValue}>{totalExercises}</Text>
            <Text style={styles.statLabel}>Exercícios</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="repeat" size={24} color="#0776A0" />
            <Text style={styles.statValue}>{totalReps}</Text>
            <Text style={styles.statLabel}>Repetições</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done-circle" size={24} color="#0776A0" />
            <Text style={styles.statValue}>{totalMetasDone}</Text>
            <Text style={styles.statLabel}>Metas</Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 20, paddingBottom: 40 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, paddingHorizontal: 8 },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: '#0776A0', justifyContent: 'center', alignItems: 'center',
  },
  userInfo: { marginLeft: 16, flex: 1 },
  userName: { fontSize: 22, fontWeight: '700', color: '#111827' },
  userEmail: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    width: STAT_CARD_WIDTH, backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
  },
  statValue: { fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' },
  logoutButton: {
    flexDirection: 'row', backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginTop: 16,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  levelUpBox: {
    flexDirection: 'row', backgroundColor: '#10B981', padding: 16, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16, gap: 10,
  },
  levelUpText: { fontSize: 18, fontWeight: '700', color: '#fff' },
});
