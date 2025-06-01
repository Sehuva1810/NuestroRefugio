
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Plus, Upload, Mic, X, Eye, EyeOff, Calendar, Image, MessageCircle, Loader } from 'lucide-react';
import { savePost, loadPosts, uploadFile } from './utils/firebaseUtils';

const AnniversaryApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    color: 'pink',
    type: 'text'
  });
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Cargar posts desde Firebase
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser') || '';
    setCurrentUser(savedUser);
    
    if (savedUser) {
      setIsAuthenticated(true);
      loadPostsFromFirebase();
    }
  }, []);

  const loadPostsFromFirebase = async () => {
    setLoading(true);
    try {
      const firebasePosts = await loadPosts();
      setPosts(firebasePosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Si falla Firebase, mostrar posts de ejemplo
      setPosts([
        {
          id: 'example-1',
          title: "Te extraño mucho ❤️",
          content: "Cada momento sin ti se siente eterno. No puedo esperar a verte de nuevo y abrazarte fuerte.",
          color: "pink",
          type: "text",
          date: new Date().toISOString(),
          author: "Ternurin"
        }
      ]);
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async () => {
    let currentUser = '';
    let userTheme = '';
    
    if (password === '1307') {
      // Cumpleaños de ella
      currentUser = 'Princesita Flojita';
      userTheme = 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
      document.body.style.background = userTheme;
      localStorage.setItem('currentUser', currentUser);
      setCurrentUser(currentUser);
      await loadPostsFromFirebase();
    } else if (password === '1810') {
      // Tu cumpleaños
      currentUser = 'Ternurin';
      userTheme = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword('');
      document.body.style.background = userTheme;
      localStorage.setItem('currentUser', currentUser);
      setCurrentUser(currentUser);
      await loadPostsFromFirebase();
    } else {
      alert('Contraseña incorrecta ❤️');
      setPassword('');
    }
  };

  const handleAddPost = async () => {
    if (newPost.title.trim() || newPost.content.trim()) {
      setLoading(true);
      try {
        const post = {
          title: newPost.title,
          content: newPost.content,
          color: newPost.color,
          type: newPost.type,
          author: currentUser || "Anónimo"
        };
        
        await savePost(post);
        setNewPost({ title: '', content: '', color: 'pink', type: 'text' });
        setShowNewPostForm(false);
        
        // Recargar posts
        await loadPostsFromFirebase();
      } catch (error) {
        console.error('Error saving post:', error);
        alert('Error guardando la nota. Inténtalo de nuevo.');
      }
      setLoading(false);
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        // Subir archivo a Firebase Storage
        const fileURL = await uploadFile(file, type === 'image' ? 'images' : 'audio');
        
        // Crear post con la URL del archivo
        const post = {
          title: type === 'image' ? "Nueva foto para ti 📸" : "Audio mensaje 🎵",
          content: fileURL,
          color: type === 'image' ? 'yellow' : 'green',
          type: type,
          author: currentUser || "Anónimo"
        };
        
        await savePost(post);
        await loadPostsFromFirebase();
        
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error subiendo archivo. Inténtalo de nuevo.');
      }
      setUploading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      pink: 'bg-pink-200 border-pink-300 shadow-pink-200/50',
      blue: 'bg-blue-200 border-blue-300 shadow-blue-200/50',
      yellow: 'bg-yellow-200 border-yellow-300 shadow-yellow-200/50',
      green: 'bg-green-200 border-green-300 shadow-green-200/50',
      purple: 'bg-purple-200 border-purple-300 shadow-purple-200/50'
    };
    return colors[color] || colors.pink;
  };

  // Página falsa de películas
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header falso */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              🎬 Cine & Películas
            </h1>
            <p className="text-xl text-gray-300">Las mejores reseñas y recomendaciones</p>
          </div>

          {/* Grid de películas falsas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {['Avatar 2', 'Top Gun Maverick', 'Black Panther', 'Spider-Man', 'The Batman', 'Dune'].map((movie, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{movie}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{movie}</h3>
                <p className="text-gray-300 text-sm">Reseña completa disponible...</p>
              </div>
            ))}
          </div>

          {/* Botón secreto */}
          <div className="text-center">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Eye className="w-5 h-5" />
              Ver Contenido Especial
            </button>
          </div>
        </div>

        {/* Modal de contraseña */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Especial</h2>
                <p className="text-gray-600">Ingresa la fecha especial</p>
              </div>
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="MMDD"
                className="w-full p-4 border-2 border-gray-300 rounded-lg mb-6 text-center text-xl font-bold tracking-wider focus:border-pink-500 focus:outline-none"
                maxLength="4"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 px-6 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 py-3 px-6 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Aplicación principal (refugio)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header del refugio */}
        <div className="text-center mb-8 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            💕 Nuestro Refugio Digital 💕
          </h1>
          <p className="text-gray-600">Un espacio especial para nosotros</p>
          {currentUser && (
            <p className={`text-sm mt-2 font-semibold ${
              currentUser === 'Ternurin' ? 'text-blue-600' : 'text-pink-600'
            }`}>
              Bienvenid@ {currentUser} ✨
            </p>
          )}
          <button
            onClick={() => {
              setIsAuthenticated(false); 
              setCurrentUser('');
              localStorage.removeItem('currentUser');
              document.body.style.background = '';
            }}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
          >
            <EyeOff className="w-4 h-4" />
            Ocultar
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center mb-8">
            <Loader className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-2" />
            <p className="text-gray-600">Cargando mensajes de amor...</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowNewPostForm(true)}
            disabled={loading}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Nueva Nota
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />}
            {uploading ? 'Subiendo...' : 'Subir Foto'}
          </button>
          
          <button
            onClick={() => audioInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
            {uploading ? 'Subiendo...' : 'Audio'}
          </button>
        </div>

        {/* Inputs ocultos para archivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'image')}
          className="hidden"
        />
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => handleFileUpload(e, 'audio')}
          className="hidden"
        />

        {/* Formulario nueva nota */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Nueva Nota de Amor</h3>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Título (ej: Te extraño, ¿Te acuerdas?, Hoy pensé en ti...)"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:border-pink-500 focus:outline-none"
              />
              
              <textarea
                placeholder="Escribe tu mensaje de amor aquí... 💕"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:border-pink-500 focus:outline-none resize-none"
              />
              
              <div className="flex gap-2 mb-4">
                <span className="text-sm text-gray-600 mr-2">Color:</span>
                {['pink', 'blue', 'yellow', 'green', 'purple'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewPost({...newPost, color})}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newPost.color === color ? 'border-gray-800' : 'border-gray-300'
                    } ${getColorClasses(color).split(' ')[0]}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="flex-1 py-3 px-6 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPost}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Guardando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`${getColorClasses(post.color)} p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg leading-tight flex-1 pr-2">{post.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  post.author === 'Ternurin' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-pink-100 text-pink-700'
                }`}>
                  {post.author}
                </span>
              </div>
              
              {post.type === 'text' && (
                <p className="text-gray-700 mb-3 leading-relaxed">{post.content}</p>
              )}
              
              {post.type === 'image' && (
                <div className="mb-3">
                  <img 
                    src={post.content} 
                    alt="Foto de amor" 
                    className="w-full max-h-80 object-contain rounded-lg shadow-md bg-white/50"
                  />
                </div>
              )}
              
              {post.type === 'audio' && (
                <div className="mb-3">
                  <audio controls className="w-full">
                    <source src={post.content} type="audio/mpeg" />
                  </audio>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex flex-col">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('es-ES')}
                  </span>
                  <span className="text-xs text-gray-500 ml-5">
                    {new Date(post.date).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500 fill-current" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aún no hay mensajes de amor...</p>
            <p className="text-gray-400">¡Crea el primero!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnniversaryApp;