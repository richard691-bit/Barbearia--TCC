import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey:            "AIzaSyCIkN4dtsMy_XCoGucHWrzOGeDtDbmD9SY",
    authDomain:        "barbearia-tcc123.firebaseapp.com",
    projectId:         "barbearia-tcc123",
    storageBucket:     "barbearia-tcc123.firebasestorage.app",
    messagingSenderId: "579297265392",
    appId:             "1:579297265392:web:3528dfc37a4b29fef8e435"
};

// Evita inicializar duas vezes
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const hoje = new Date().toISOString().split('T')[0];

// Injeta o sininho no header automaticamente
function injetarSininho() {
    const nav = document.querySelector('.nav-inner');
    if (!nav) return;

    const div = document.createElement('div');
    div.id = 'notificacao-container';
    div.style.cssText = 'position:relative; cursor:pointer; display:none;';
    div.innerHTML = `
        <span style="font-size:22px;">🔔</span>
        <span id="badge-notificacao" style="display:none; position:absolute; top:-5px; right:-5px;
              background:red; color:white; border-radius:50%; padding:2px 6px;
              font-size:11px; font-weight:bold;">0</span>
    `;
    div.addEventListener('click', () => {
        window.location.href = 'painel.html';
    });

    // Insere antes do botão de menu
    const btnMenu = document.getElementById('btn-menu-sidebar');
    nav.insertBefore(div, btnMenu);
}

onAuthStateChanged(auth, async (usuario) => {
    if (!usuario) return;

    try {
        const snap = await getDoc(doc(db, 'usuarios', usuario.uid));
        if (!snap.exists() || snap.data().role !== 'admin') return;

        // É admin: mostra o sininho
        injetarSininho();
        const container = document.getElementById('notificacao-container');
        container.style.display = 'block';

        // Monitora pendentes de hoje
        const q = query(
            collection(db, 'agendamentos'),
            where('status', '==', 'pendente'),
            where('data', '==', hoje)
        );

        onSnapshot(q, (snapshot) => {
            const badge = document.getElementById('badge-notificacao');
            if (snapshot.size > 0) {
                badge.style.display = 'block';
                badge.textContent   = snapshot.size;
            } else {
                badge.style.display = 'none';
            }
        });

    } catch (e) {
        console.error('Erro no sininho:', e);
    }
});