// auth.js — Autenticação Firebase

import { auth, db } from './firebaseConfig.js';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';

const provider = new GoogleAuthProvider();

// ---- SALVAR USUÁRIO NO FIRESTORE ----
async function salvarUsuario(user, nomeExtra = null) {
    const ref  = doc(db, 'usuarios', user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        await setDoc(ref, {
            nome:     nomeExtra || user.displayName || '',
            email:    user.email,
            telefone: '',
            criadoEm: serverTimestamp()
        });
    }
}

// ---- ATUALIZAR TELEFONE DO USUÁRIO ----
// Chamada pelo agendamento quando o cliente informa o telefone
export async function atualizarTelefone(uid, telefone) {
    if (!uid || !telefone) return;
    try {
        const ref  = doc(db, 'usuarios', uid);
        const snap = await getDoc(ref);

        // Só atualiza se o telefone ainda estiver vazio
        if (snap.exists() && !snap.data().telefone) {
            await updateDoc(ref, { telefone });
        }
    } catch (e) {
        console.error('Erro ao atualizar telefone:', e);
    }
}

// ---- LOGIN COM GOOGLE ----
export async function loginGoogle() {
    try {
        const resultado = await signInWithPopup(auth, provider);
        await salvarUsuario(resultado.user);
        return { sucesso: true, usuario: resultado.user };
    } catch (erro) {
        return { sucesso: false, erro: traduzirErro(erro.code) };
    }
}

// ---- LOGIN COM EMAIL E SENHA ----
export async function loginEmail(email, senha) {
    try {
        const resultado = await signInWithEmailAndPassword(auth, email, senha);
        return { sucesso: true, usuario: resultado.user };
    } catch (erro) {
        return { sucesso: false, erro: traduzirErro(erro.code) };
    }
}

// ---- CADASTRO COM EMAIL E SENHA ----
export async function cadastrar(nome, email, senha) {
    try {
        const resultado = await createUserWithEmailAndPassword(auth, email, senha);
        await updateProfile(resultado.user, { displayName: nome });
        await salvarUsuario(resultado.user, nome);
        return { sucesso: true, usuario: resultado.user };
    } catch (erro) {
        return { sucesso: false, erro: traduzirErro(erro.code) };
    }
}

// ---- LOGOUT ----
export async function logout() {
    await signOut(auth);
    window.location.href = '../index.html';
}

// ---- BUSCAR DADOS DO USUÁRIO NO FIRESTORE ----
export async function buscarDadosUsuario(uid) {
    const ref  = doc(db, 'usuarios', uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

// ---- OBSERVAR ESTADO DE LOGIN ----
export function observarLogin(callback) {
    onAuthStateChanged(auth, callback);
}

// ---- USUÁRIO ATUAL ----
export function usuarioAtual() {
    return auth.currentUser;
}

// ---- TRADUZIR ERROS DO FIREBASE ----
function traduzirErro(code) {
    const erros = {
        'auth/user-not-found':       'E-mail não encontrado.',
        'auth/wrong-password':       'Senha incorreta.',
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/weak-password':        'A senha deve ter no mínimo 6 caracteres.',
        'auth/invalid-email':        'E-mail inválido.',
        'auth/popup-closed-by-user': 'Login com Google cancelado.',
        'auth/too-many-requests':    'Muitas tentativas. Tente novamente mais tarde.',
        'auth/invalid-credential':   'E-mail ou senha incorretos.'
    };
    return erros[code] || 'Ocorreu um erro. Tente novamente.';
}
