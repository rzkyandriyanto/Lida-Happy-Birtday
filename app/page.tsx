"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

// ============================================
// DATA — Konten cerita yang di-hardcode
// ============================================
const SLIDES = [
  {
    image: "/foto-1.jpg",
    text: "Hai Lida Ismawati... Selamat datang di rekap singkat tentang kita.",
  },
  {
    image: "/foto-2.jpg",
    text: "Dari tanggal 5 September dulu, nggak kerasa kita udah jalan bareng selama 8 tahun lebih.",
  },
  {
    image: "/foto-3.jpg",
    text: "Walaupun 5 tahun belakangan ini kita harus kepisah jarak dan LDR-an...",
  },
  {
    image: "/foto-4.jpg",
    text: "Tapi jarak nggak pernah ngurangin rasa banggaku punya kamu.",
  },
  {
    image: "/foto-5.jpg",
    text: "Melihat kamu kerja keras dan ikhlas pakai gajimu buat nyekolahin adik-adik...",
  },
  {
    image: "/foto-6.jpg",
    text: "Jujur, itu bikin aku terharu dan makin kagum sama kamu. Kamu hebat banget, sayang.",
  },
  {
    image: "/foto-7.jpg",
    text: "Tapi ada satu request nih... Tolong seblak dan makanan pedasnya dikurangin ya! Sayangi perutmu juga 🥺",
  },
  {
    image: "/foto-8.jpg",
    text: "Semoga semua perjuanganmu berbuah manis, kamu selalu sehat, dan semoga LDR ini cepat usai.",
  },
  {
    image: "/foto-9.jpg",
    text: "Selamat Ulang Tahun yang ke-23, Lida! Terima kasih sudah berjuang bersamaku. 🎉🎂",
  },
];

const SLIDE_DURATION = 5000; // 5 detik per slide
const TOTAL_SLIDES = SLIDES.length;
const MUSIC_START_TIME = 86; // Mulai dari menit 1:26 = 86 detik

// ============================================
// DATA PARTIKEL STATIS (menghindari hydration mismatch)
// ============================================
const PARTICLE_DATA = [
  { w: 3.2, h: 4.1, a: 0.35, x: 12, y: 8,  dur: 3.5, del: 0.2 },
  { w: 2.8, h: 3.5, a: 0.28, x: 85, y: 15, dur: 4.2, del: 1.1 },
  { w: 4.5, h: 2.9, a: 0.45, x: 45, y: 72, dur: 2.8, del: 0.8 },
  { w: 3.0, h: 4.8, a: 0.32, x: 92, y: 55, dur: 5.1, del: 2.0 },
  { w: 2.3, h: 3.3, a: 0.52, x: 28, y: 90, dur: 3.2, del: 0.5 },
  { w: 4.1, h: 2.5, a: 0.38, x: 67, y: 35, dur: 4.8, del: 1.8 },
  { w: 3.7, h: 3.9, a: 0.25, x: 8,  y: 60, dur: 2.5, del: 2.5 },
  { w: 2.6, h: 4.4, a: 0.41, x: 53, y: 22, dur: 5.5, del: 0.3 },
  { w: 4.9, h: 3.1, a: 0.30, x: 75, y: 82, dur: 3.8, del: 1.4 },
  { w: 3.4, h: 2.7, a: 0.48, x: 38, y: 45, dur: 4.5, del: 2.2 },
  { w: 2.1, h: 4.6, a: 0.36, x: 95, y: 70, dur: 3.0, del: 0.9 },
  { w: 4.3, h: 3.6, a: 0.42, x: 18, y: 38, dur: 5.8, del: 1.6 },
];

const EMOJI_DATA = [
  { x: 5,  dur: 4.2, del: 0.1, fs: 1.3 },
  { x: 15, dur: 5.5, del: 0.8, fs: 1.8 },
  { x: 25, dur: 3.8, del: 1.5, fs: 1.1 },
  { x: 35, dur: 6.1, del: 0.3, fs: 2.0 },
  { x: 42, dur: 4.5, del: 2.1, fs: 1.5 },
  { x: 50, dur: 3.2, del: 0.6, fs: 1.2 },
  { x: 58, dur: 5.8, del: 1.9, fs: 1.7 },
  { x: 65, dur: 4.0, del: 0.4, fs: 1.4 },
  { x: 72, dur: 6.5, del: 2.5, fs: 1.9 },
  { x: 80, dur: 3.5, del: 1.2, fs: 1.1 },
  { x: 88, dur: 5.2, del: 0.7, fs: 2.1 },
  { x: 95, dur: 4.8, del: 1.8, fs: 1.6 },
  { x: 10, dur: 6.0, del: 2.8, fs: 1.3 },
  { x: 22, dur: 3.9, del: 0.2, fs: 1.8 },
  { x: 33, dur: 5.1, del: 1.4, fs: 1.0 },
  { x: 48, dur: 4.3, del: 2.3, fs: 2.2 },
  { x: 55, dur: 6.3, del: 0.9, fs: 1.5 },
  { x: 68, dur: 3.6, del: 1.7, fs: 1.2 },
  { x: 78, dur: 5.7, del: 2.6, fs: 1.9 },
  { x: 90, dur: 4.1, del: 0.5, fs: 1.4 },
];

// ============================================
// KOMPONEN PARTIKEL DEKORATIF
// ============================================
function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
      {PARTICLE_DATA.map((p, i) => (
        <div
          key={i}
          className="twinkle absolute rounded-full"
          style={{
            width: `${p.w}px`,
            height: `${p.h}px`,
            background: `rgba(212, 168, 83, ${p.a})`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--twinkle-duration" as any]: `${p.dur}s`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--twinkle-delay" as any]: `${p.del}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// KOMPONEN HUJAN EMOJI (slide terakhir)
// ============================================
function EmojiRain() {
  const emojis = ["🎉", "🎂", "🎈", "💖", "✨", "🥳", "🎁", "💫", "🌟", "🎊"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[6]">
      {EMOJI_DATA.map((e, i) => (
        <span
          key={i}
          className="emoji-rain absolute text-xl"
          style={{
            left: `${e.x}%`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--rain-duration" as any]: `${e.dur}s`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--rain-delay" as any]: `${e.del}s`,
            fontSize: `${e.fs}rem`,
          }}
        >
          {emojis[i % emojis.length]}
        </span>
      ))}
    </div>
  );
}

// ============================================
// KOMPONEN PROGRESS BAR (gaya Instagram Stories)
// ============================================
function ProgressBar({
  currentSlide,
  totalSlides,
  isPaused,
}: {
  currentSlide: number;
  totalSlides: number;
  isPaused: boolean;
}) {
  return (
    <div className="flex gap-[3px] w-full px-3 pt-3 pb-1 z-[20]">
      {Array.from({ length: totalSlides }).map((_, i) => (
        <div key={i} className="progress-segment">
          <div
            className={`progress-fill ${
              i < currentSlide
                ? "w-full"
                : i === currentSlide
                ? "progress-fill-animate"
                : "w-0"
            }`}
            style={{
              width: i < currentSlide ? "100%" : i > currentSlide ? "0%" : undefined,
              animationPlayState: isPaused ? "paused" : "running",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================
// KOMPONEN UTAMA: BIRTHDAY WRAPPED
// ============================================
export default function BirthdayWrapped() {
  // --- State ---
  const [phase, setPhase] = useState<"landing" | "camera" | "story" | "cake" | "final">("landing");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [textKey, setTextKey] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [candlesLit, setCandlesLit] = useState([true, true, true]); // 3 lilin

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(SLIDE_DURATION);

  // --- Navigasi Slide ---
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      if (index < 0 || index >= TOTAL_SLIDES) return;

      setIsTransitioning(true);

      // Reset timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Animasi transisi singkat
      setTimeout(() => {
        setCurrentSlide(index);
        setTextKey((prev) => prev + 1);
        remainingRef.current = SLIDE_DURATION;
        setIsTransitioning(false);
      }, 100);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      goToSlide(currentSlide + 1);
    } else {
      setPhase("cake");
    }
  }, [currentSlide, goToSlide]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  // --- Timer Auto-advance ---
  useEffect(() => {
    if (phase !== "story" || isPaused || isTransitioning) return;

    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      if (currentSlide < TOTAL_SLIDES - 1) {
        goToSlide(currentSlide + 1);
      } else {
        setPhase("cake");
      }
    }, remainingRef.current);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // Simpan sisa waktu
        const elapsed = Date.now() - startTimeRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
    };
  }, [phase, currentSlide, isPaused, isTransitioning, goToSlide]);

  // --- Pause/Resume saat hold ---
  const handleHoldStart = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }
    // Pause musik saat hold
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const handleHoldEnd = useCallback(() => {
    setIsPaused(false);
    // Resume musik saat lepas hold
    if (audioRef.current && audioRef.current.paused && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  // --- Tap Handler (kiri 30% = prev, kanan 70% = next) ---
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoldingRef = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isHoldingRef.current = false;

      holdTimerRef.current = setTimeout(() => {
        isHoldingRef.current = true;
        handleHoldStart();
      }, 200);

      // Prevent default untuk menghindari masalah di mobile
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [handleHoldStart]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }

      if (isHoldingRef.current) {
        // Sedang hold, lepaskan pause
        handleHoldEnd();
        isHoldingRef.current = false;
        return;
      }

      // Tap biasa — cek posisi
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const threshold = rect.width * 0.3;

      if (x < threshold) {
        goPrev();
      } else {
        goNext();
      }
    },
    [handleHoldEnd, goNext, goPrev]
  );

  // --- Mulai Musik Background ---
  const startMusic = useCallback(() => {
    const audio = new Audio("/bg-music.webm");
    audio.currentTime = MUSIC_START_TIME;
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    audio.play().catch(() => {
      console.warn("Autoplay musik diblokir browser.");
    });
  }, []);

  // --- Toggle Mute ---
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.muted = true;
      }
    }
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  // --- Effect: Setup Video Stream ---
  useEffect(() => {
    if (phase === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  // --- Mulai Kamera ---
  const startCamera = useCallback(async () => {
    try {
      // Cek apakah API MediaDevices tersedia (biasanya undefined jika diakses via IP lokal HTTP di HP)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("API Kamera tidak didukung di jaringan non-HTTPS.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      setPhase("camera");
    } catch (err) {
      // Kamera gagal — tetap mulai cerita tanpa kamera (langsung lompat ke story)
      console.warn("Kamera tidak tersedia, melanjutkan tanpa kamera.", err);
      setCameraError(true);
      startMusic();
      setPhase("story");
    }
  }, [startMusic]);

  // --- Ambil Foto ---
  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Balikkan gambar agar seperti cermin
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(dataUrl);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    
    startMusic();
    setPhase("story");
  }, [startMusic]);

  // --- Cleanup kamera & audio saat unmount ---
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Auto-transition ke final setelah semua lilin mati ---
  useEffect(() => {
    if (phase !== "cake") return;
    const allBlown = candlesLit.every((c) => !c);
    if (!allBlown) return;

    const timer = setTimeout(() => {
      setPhase("final");
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase, candlesLit]);

  // ============================================
  // RENDER: LAYAR MULAI
  // ============================================
  if (phase === "landing") {
    return (
      <div className="start-bg fixed inset-0 flex flex-col items-center justify-center h-[100dvh] overflow-hidden">
        {/* Partikel dekoratif */}
        <FloatingParticles />

        {/* Konten utama */}
        <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
          {/* Judul */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-[#d4a853]/60">
              ✦ Rekap Perjalanan Kita ✦
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              <span className="text-warm-white">Lida&apos;s</span>
              <br />
              <span
                className="bg-gradient-to-r from-[#d4a853] via-[#f0d48a] to-[#d4a853] bg-clip-text text-transparent"
              >
                23rd Birthday
              </span>
              <br />
              <span className="text-warm-white">Wrapped</span>
            </h1>
            <p className="text-sm text-warm-white/40 mt-1 max-w-[280px]">
              Kumpulan cerita tentang perjalanan kita bersama selama ini
            </p>
          </div>

          {/* Tombol mulai */}
          <button className="start-btn" onClick={startCamera}>
            Mulai Cerita
          </button>

          {/* Petunjuk */}
          <p className="text-xs text-warm-white/30">
            Akan meminta izin akses kamera depan
          </p>
        </div>

        {/* Ornamen bawah */}
        <div className="absolute bottom-8 flex gap-3 opacity-30">
          <span className="text-lg">🎂</span>
          <span className="text-lg">✨</span>
          <span className="text-lg">💖</span>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: LAYAR KAMERA (AMBIL FOTO)
  // ============================================
  if (phase === "camera") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        
        {/* Overlay Top */}
        <div className="absolute top-16 left-0 right-0 px-6 text-center z-10 animate-fade-slide-up">
          <p className="text-white font-semibold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Ambil foto dulu yuk buat profile! 📸
          </p>
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center z-10">
          <button 
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full border-[4px] border-white/80 bg-white/20 flex items-center justify-center transition-transform active:scale-90"
            aria-label="Ambil Foto"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-white shadow-lg"></div>
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: LAYAR TIUP LILIN (CAKE)
  // ============================================

  if (phase === "cake") {
    const allBlown = candlesLit.every((c) => !c);

    const blowCandle = (index: number) => {
      setCandlesLit((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    };

    const CANDLE_COLORS = ["#ff6b6b", "#74b9ff", "#a29bfe"];

    return (
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.08) 0%, rgba(0,0,0,1) 70%)"
          }} />
        </div>

        <FloatingParticles />

        {/* Instruksi */}
        <div className="absolute top-24 sm:top-32 left-0 right-0 px-4 z-20 text-center animate-fade-slide-up">
          <p className="text-warm-white/90 text-xl font-semibold mb-1 drop-shadow-md">
            {allBlown ? "🎉 Yeaay!" : "Tiup lilinnya, sayang! 🕯️"}
          </p>
          <p className="text-warm-white/60 text-sm drop-shadow">
            {allBlown ? "Semoga wishes-nya terkabul!" : "Tap api lilin untuk meniupnya"}
          </p>
        </div>

        {/* 3D Cake */}
        <div className="relative z-10 cake-scene">
          <div className="cake-wrapper">
            {/* Candles */}
            <div className="candle-row">
              {candlesLit.map((isLit, i) => (
                <div
                  key={i}
                  className="candle"
                  onClick={() => isLit && blowCandle(i)}
                >
                  {/* Flame */}
                  <div className={`flame-container ${!isLit ? "flame-out" : ""}`}>
                    {isLit ? (
                      <>
                        <div className="flame-glow" />
                        <div className="flame-outer" />
                        <div className="flame-inner" />
                      </>
                    ) : (
                      <div className="smoke" />
                    )}
                  </div>

                  {/* Wick */}
                  <div className="candle-wick" />

                  {/* Stick */}
                  <div
                    className="candle-stick"
                    style={{ background: `linear-gradient(180deg, ${CANDLE_COLORS[i]}, ${CANDLE_COLORS[i]}dd)` }}
                  />
                </div>
              ))}
            </div>

            {/* Cake Layers */}
            <div className="cake-layer cake-top" style={{ position: "relative" }}>
              <div className="frosting">
                {[12, 16, 10, 14, 12].map((h, i) => (
                  <div key={i} className="drip" style={{ height: `${h}px`, animationDelay: `${i * 0.3}s` }} />
                ))}
              </div>
              {/* Sprinkles */}
              <span className="cake-decoration" style={{ top: "15px", left: "20px" }}>✿</span>
              <span className="cake-decoration" style={{ top: "20px", right: "25px" }}>❀</span>
              <span className="cake-decoration" style={{ top: "30px", left: "60px", fontSize: "8px" }}>♥</span>
            </div>

            <div className="cake-layer cake-middle" style={{ position: "relative" }}>
              <div className="frosting">
                {[14, 10, 16, 12, 14, 10].map((h, i) => (
                  <div key={i} className="drip" style={{ height: `${h}px`, animationDelay: `${i * 0.25}s` }} />
                ))}
              </div>
            </div>

            <div className="cake-layer cake-bottom" style={{ position: "relative" }}>
              <div className="frosting">
                {[12, 16, 14, 10, 16, 12, 14].map((h, i) => (
                  <div key={i} className="drip" style={{ height: `${h}px`, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>

            {/* Plate */}
            <div className="cake-plate" />
          </div>
        </div>

        {/* Happy Birthday text below cake */}
        <div className="relative z-10 mt-8 text-center animate-fade-slide-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-[#d4a853] text-2xl font-bold">Happy Birthday</p>
          <p className="text-warm-white/60 text-sm mt-1">Lida Ismawati 🎂</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: LAYAR FINAL (FOTO TANGKAPAN)
  // ============================================
  if (phase === "final") {
    return (
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          {capturedPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={capturedPhoto} className="w-full h-full object-cover opacity-40 blur-md" alt="Background" />
          ) : null}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <FloatingParticles />
        <EmojiRain />

        <div className="relative z-10 flex flex-col items-center px-6 animate-fade-slide-up w-full max-w-[320px]">
          {/* Polaroid Frame */}
          {capturedPhoto && (
            <div className="bg-white p-3 pb-12 shadow-2xl rotate-[-2deg] mb-10 w-full rounded-sm relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedPhoto} alt="Hasil Foto" className="w-full aspect-square object-cover bg-gray-200" />
              <div 
                className="absolute bottom-4 left-0 right-0 text-center text-black/80 text-xl font-medium"
                style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
              >
                You & Me ❤️
              </div>
            </div>
          )}

          <h2 className="text-3xl font-bold text-warm-white mb-2 text-center">
            Happy 23rd Birthday!
          </h2>
          <p className="text-warm-white/70 text-center text-sm leading-relaxed">
            Semoga harimu menyenangkan, sayang.
            <br />
            Terima kasih untuk semuanya.
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: LAYAR CERITA (SLIDES)
  // ============================================
  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === TOTAL_SLIDES - 1;

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-black">
      {/* ---- Background Image ---- */}
      <div className="absolute inset-0 z-[1]">
        <Image
          key={`bg-${currentSlide}`}
          src={slide.image}
          alt={`Foto kenangan ${currentSlide + 1}`}
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            opacity: isTransitioning ? 0.5 : 1,
            transition: "opacity 0.3s ease",
          }}
          loading="eager"
        />
      </div>

      {/* ---- Dark Overlay ---- */}
      <div className="slide-overlay absolute inset-0 z-[2]" />

      {/* ---- Partikel (slide terakhir = hujan emoji) ---- */}
      {isLastSlide ? <EmojiRain /> : <FloatingParticles />}

      {/* ---- Instagram Story Header ---- */}
      <div className="absolute top-0 left-0 right-0 z-[20]">
        {/* Progress Bar */}
        <ProgressBar
          currentSlide={currentSlide}
          totalSlides={TOTAL_SLIDES}
          isPaused={isPaused}
        />

        {/* Profile Row: avatar + username + timestamp + menu */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          {/* Profile Picture (dari statis) */}
          <div className="ig-profile-pic w-8 h-8 rounded-full overflow-hidden border-[1.5px] border-white/30 flex-shrink-0">
            <Image
              src="/profile.jpg"
              alt="Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Username + Timestamp */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[13px] font-semibold text-white truncate">
              rizkyandriyanto
            </span>
            <span className="text-[13px] text-white/50 flex-shrink-0">
              2 jam
            </span>
          </div>

          {/* Three-dot menu (mute toggle) */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 p-1.5 -mr-1 transition-opacity active:opacity-50"
            aria-label={isMuted ? "Nyalakan suara" : "Matikan suara"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* Music Info Bar */}
        <div className="flex items-center gap-2 px-3 pb-2">
          {/* Equalizer Icon (animated) */}
          <div className="flex items-end gap-[2px] h-3 flex-shrink-0">
            <span className="ig-eq-bar w-[2.5px] bg-white rounded-full" style={{ animationDelay: "0s" }} />
            <span className="ig-eq-bar w-[2.5px] bg-white rounded-full" style={{ animationDelay: "0.2s" }} />
            <span className="ig-eq-bar w-[2.5px] bg-white rounded-full" style={{ animationDelay: "0.4s" }} />
          </div>
          {/* Song Info */}
          <span className="text-[12px] text-white/80 truncate">
            Ariana Grande · we can&apos;t be friends (wait for your love)
          </span>
        </div>
      </div>

      {/* ---- Tap Area ---- */}
      <div
        className="absolute inset-0 z-[15] cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
          if (isHoldingRef.current) {
            handleHoldEnd();
            isHoldingRef.current = false;
          }
        }}
      />

      {/* ---- Konten Teks ---- */}
      <div className="absolute bottom-0 left-0 right-0 z-[10] px-5 pb-12 sm:pb-16">
        <div
          key={`text-${textKey}`}
          className="animate-fade-slide-up"
        >
          {/* Nomor slide */}
          <div className="slide-counter mb-3">
            {currentSlide + 1} / {TOTAL_SLIDES}
          </div>

          {/* Teks utama */}
          <p
            className={`slide-text max-w-md ${
              isLastSlide ? "celebrate-text" : ""
            }`}
          >
            {slide.text}
          </p>
        </div>
      </div>

      {/* ---- Indikator pause ---- */}
      {isPaused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[25]">
          <div className="flex gap-2 opacity-60">
            <div className="w-3 h-10 bg-white/80 rounded-sm" />
            <div className="w-3 h-10 bg-white/80 rounded-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
