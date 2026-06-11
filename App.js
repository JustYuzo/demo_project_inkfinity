import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

import { useFonts } from "expo-font";
import {
  CrimsonText_400Regular,
  CrimsonText_700Bold,
} from "@expo-google-fonts/crimson-text";

const STORAGE_KEY = "INKFINITY_RIWAYAT_PESANAN";
const USERS_KEY = "INKFINITY_USERS";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "inkfinity123";

export default function App() {
  const [screen, setScreen] = useState("login");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupNama, setSignupNama] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedService, setSelectedService] = useState("Print Hitam Putih");
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [namaFile, setNamaFile] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [pesanan, setPesanan] = useState(null);
  const [riwayatPesanan, setRiwayatPesanan] = useState([]);

  const [fontsLoaded] = useFonts({
    CrimsonText_400Regular,
    CrimsonText_700Bold,
  });

  const layanan = [
    {
      nama: "Print Hitam Putih",
      harga: 500,
      labelHarga: "Rp500 / lembar",
      deskripsi: "Cocok untuk tugas, makalah, dan dokumen biasa.",
      icon: "🖨️",
    },
    {
      nama: "Print Warna",
      harga: 1500,
      labelHarga: "Rp1.500 / lembar",
      deskripsi: "Untuk dokumen berwarna, poster, dan gambar.",
      icon: "🌈",
    },
    {
      nama: "Fotocopy",
      harga: 300,
      labelHarga: "Rp300 / lembar",
      deskripsi: "Layanan salin dokumen cepat dan rapi.",
      icon: "📄",
    },
    {
      nama: "Scan Dokumen",
      harga: 2000,
      labelHarga: "Rp2.000 / file",
      deskripsi: "Mengubah dokumen fisik menjadi file digital.",
      icon: "📑",
    },
    {
      nama: "Jilid",
      harga: 5000,
      labelHarga: "Rp5.000",
      deskripsi: "Untuk laporan, makalah, dan tugas akhir.",
      icon: "📚",
    },
    {
      nama: "Laminating",
      harga: 3000,
      labelHarga: "Rp3.000",
      deskripsi: "Melindungi dokumen agar lebih awet.",
      icon: "🪪",
    },
  ];

  const selectedData =
    layanan.find((item) => item.nama === selectedService) || layanan[0];

  const jumlahAngka = Number(jumlah);
  const estimasiTotal =
    !isNaN(jumlahAngka) && jumlahAngka > 0
      ? selectedData.harga * jumlahAngka
      : 0;


  const ambilRiwayatPesanan = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        setRiwayatPesanan(JSON.parse(data));
      }
    } catch (error) {
      console.log("Gagal mengambil riwayat pesanan:", error);
    }
  };

  const simpanRiwayatPesanan = async (dataBaru) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataBaru));
    } catch (error) {
      console.log("Gagal menyimpan riwayat pesanan:", error);
    }
  };

  const ambilUsers = async () => {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log("Gagal mengambil data user:", error);
      return [];
    }
  };

  const simpanUsers = async (dataUsers) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(dataUsers));
    } catch (error) {
      console.log("Gagal menyimpan data user:", error);
    }
  };

  const handleSignup = async () => {
    if (
      signupNama.trim() === "" ||
      signupUsername.trim() === "" ||
      signupPassword.trim() === ""
    ) {
      Alert.alert("Peringatan", "Nama, username, dan password wajib diisi.");
      return;
    }

    if (signupUsername.trim().toLowerCase() === ADMIN_USERNAME) {
      Alert.alert("Peringatan", "Username admin tidak dapat digunakan.");
      return;
    }

    const users = await ambilUsers();

    const usernameSudahAda = users.some(
      (user) => user.username.toLowerCase() === signupUsername.trim().toLowerCase()
    );

    if (usernameSudahAda) {
      Alert.alert("Peringatan", "Username sudah terdaftar.");
      return;
    }

    const userBaru = {
      id: Date.now(),
      nama: signupNama.trim(),
      username: signupUsername.trim(),
      password: signupPassword,
    };

    await simpanUsers([...users, userBaru]);

    setSignupNama("");
    setSignupUsername("");
    setSignupPassword("");

    Alert.alert("Berhasil", "Akun berhasil dibuat. Silakan login.");
    setScreen("login");
  };

  const handleLogin = async () => {
    if (loginUsername.trim() === "" || loginPassword.trim() === "") {
      Alert.alert("Peringatan", "Username dan password wajib diisi.");
      return;
    }

    if (
      loginUsername.trim().toLowerCase() === ADMIN_USERNAME &&
      loginPassword === ADMIN_PASSWORD
    ) {
      setCurrentUser({
        id: "admin",
        nama: "Admin Inkfinity",
        username: ADMIN_USERNAME,
      });
      setIsAdmin(true);
      setLoginUsername("");
      setLoginPassword("");
      setScreen("admin");
      return;
    }

    const users = await ambilUsers();

    const userDitemukan = users.find(
      (user) =>
        user.username.toLowerCase() === loginUsername.trim().toLowerCase() &&
        user.password === loginPassword
    );

    if (!userDitemukan) {
      Alert.alert("Login Gagal", "Username atau password salah.");
      return;
    }

    setCurrentUser(userDitemukan);
    setIsAdmin(false);
    setNama(userDitemukan.nama);
    setLoginUsername("");
    setLoginPassword("");
    setScreen("home");
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setScreen("login");
    setNama("");
    setJumlah("");
    setNamaFile("");
    setCatatan("");
    setPesanan(null);
  };

const pilihFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/*",
      ],
      copyToCacheDirectory: true,
    });


    if (!result.canceled) {
      const file = result.assets[0];

      setSelectedFile(file);
      setNamaFile(file.name);

      Alert.alert("File Dipilih", file.name);
    }
  } catch (error) {
    Alert.alert("Error", "Gagal memilih file.");
    console.log("Gagal memilih file:", error);
  }
};

const getMimeType = (fileName, fallbackMimeType) => {
  if (fallbackMimeType) return fallbackMimeType;

  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "pdf") return "application/pdf";
  if (ext === "doc") return "application/msword";
  if (ext === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";

  return "application/octet-stream";
};

const uploadFile = async () => {
  if (!selectedFile) {
    throw new Error("File belum dipilih.");
  }

  const maxSize = 10 * 1024 * 1024;

  if (selectedFile.size && selectedFile.size > maxSize) {
    throw new Error("Ukuran file maksimal 10 MB.");
  }

  const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `orders/${Date.now()}_${safeFileName}`;
  const contentType = getMimeType(selectedFile.name, selectedFile.mimeType);

  let arrayBuffer;

  if (selectedFile.uri?.startsWith("data:")) {
    const base64Data = selectedFile.uri.split(",")[1];
    arrayBuffer = decode(base64Data);
  } else if (selectedFile.uri?.startsWith("file:")) {
    const base64Data = await FileSystem.readAsStringAsync(selectedFile.uri, {
      encoding: "base64",
    });
    arrayBuffer = decode(base64Data);
  } else {
    const response = await fetch(selectedFile.uri);
    arrayBuffer = await response.arrayBuffer();
  }

  const { error: uploadError } = await supabase.storage
    .from("order-files")
    .upload(filePath, arrayBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("order-files")
    .getPublicUrl(filePath);

  return {
    fileName: selectedFile.name,
    filePath,
    fileUrl: data.publicUrl,
  };
};

const formatOrderData = (data) => {
  return {
    id: data.id,
    userId: data.user_id,
    username: data.user_name,
    nama: data.user_name,
    name: data.user_name,
    layanan: data.service_name,
    jumlah: String(data.quantity),
    namaFile: data.file_name,
    fileUrl: data.file_url,
    filePath: data.file_path,
    total: data.total,
    catatan: data.notes || "",
    status: data.status,
    tanggal: new Date(data.created_at).toLocaleDateString("id-ID"),
    waktu: new Date(data.created_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const ambilPesananOnline = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const hasilFormat = (data || []).map((item) => formatOrderData(item));
    setRiwayatPesanan(hasilFormat);
  } catch (error) {
    console.log("Gagal mengambil pesanan online:", error?.message || error);
  }
};

useEffect(() => {
  ambilPesananOnline();

  const channel = supabase
    .channel("orders-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      () => {
        ambilPesananOnline();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  const buatPesanan = async () => {
    if (!currentUser) {
      Alert.alert("Peringatan", "Silakan login terlebih dahulu.");
      setScreen("login");
      return;
    }

    if (nama.trim() === "" || jumlah.trim() === "") {
      Alert.alert("Peringatan", "Nama dan jumlah harus diisi.");
      return;
    }

    if (!selectedFile) {
      Alert.alert("Peringatan", "Silakan pilih file dokumen terlebih dahulu.");
      return;
    }

    if (isNaN(Number(jumlah)) || Number(jumlah) <= 0) {
      Alert.alert("Peringatan", "Jumlah harus berupa angka yang valid.");
      return;
    }

    const total = selectedData.harga * Number(jumlah);

    try {
      Alert.alert("Info", "Pesanan sedang dikirim, mohon tunggu...");

      const uploadedFile = await uploadFile();

      const orderData = {
        user_id: String(currentUser.id || currentUser.username),
        user_name: nama.trim(),
        service_name: selectedData.nama,
        service_price: selectedData.harga,
        quantity: Number(jumlah),
        total,
        file_name: uploadedFile.fileName,
        file_url: uploadedFile.fileUrl,
        file_path: uploadedFile.filePath,
        notes: catatan.trim(),
        status: "Menunggu Diproses",
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const dataPesanan = {
        ...formatOrderData(data),
        username: currentUser.username,
      };

      setPesanan(dataPesanan);
      setRiwayatPesanan((prev) => [dataPesanan, ...prev]);

      setJumlah("");
      setNamaFile("");
      setSelectedFile(null);
      setCatatan("");

      Alert.alert("Berhasil", "Pesanan berhasil dikirim secara online.");
      setScreen("detail");
    } catch (error) {
      console.log("Gagal mengirim pesanan:", error?.message || error);
      Alert.alert(
        "Error",
        error?.message || "Gagal mengirim pesanan. Cek koneksi internet atau file."
      );
    }
  };

const updateStatusPesanan = async (id, statusBaru) => {
  try { 
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: statusBaru,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const dataBaru = riwayatPesanan.map((item) =>
      item.id === id ? { ...item, status: data.status } : item
    );

    setRiwayatPesanan(dataBaru);

    if (pesanan && pesanan.id === id) {
      setPesanan({
        ...pesanan,
        status: data.status,
      });
    }

    Alert.alert("Berhasil", `Status pesanan diubah menjadi ${statusBaru}.`);
  } catch (error) {
    console.log("Gagal update status:", error);
    Alert.alert("Error", "Gagal mengubah status pesanan.");
  }
};

  const hapusSatuPesanan = async (id) => {
    const dataBaru = riwayatPesanan.filter((item) => item.id !== id);
    setRiwayatPesanan(dataBaru);
    await simpanRiwayatPesanan(dataBaru);
    Alert.alert("Berhasil", "Pesanan berhasil dihapus.");
  };

  const hapusRiwayatUser = async () => {
    if (!currentUser) return;

    const dataBaru = riwayatPesanan.filter(
      (item) => item.userId !== currentUser.id
    );

    setRiwayatPesanan(dataBaru);
    await simpanRiwayatPesanan(dataBaru);
    Alert.alert("Berhasil", "Riwayat pesanan kamu berhasil dihapus.");
  };

const riwayatUser = currentUser
  ? riwayatPesanan.filter(
      (item) => String(item.userId) === String(currentUser.id || currentUser.username)
    )
  : [];

  const getStatusStyle = (status) => {
    if (status === "Selesai") return styles.statusSelesai;
    if (status === "Sedang Diproses") return styles.statusProses;
    if (status === "Dibatalkan") return styles.statusBatal;
    return styles.statusMenunggu;
  };

  if (!fontsLoaded) {
    return null;
  }

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.title}>INKFINITY</Text>

          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Login</Text>
            <Text style={styles.authSubtitle}>
              Masuk sebagai user atau admin untuk mengakses aplikasi.
            </Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#8a7a68"
              value={loginUsername}
              onChangeText={setLoginUsername}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#8a7a68"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setScreen("signup")}
            >
              <Text style={styles.secondaryButtonText}>Buat Akun User</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "signup") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.authContainer}>
          <Text style={styles.title}>INKFINITY</Text>

          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Sign Up User</Text>
            <Text style={styles.authSubtitle}>
              Buat akun pengguna untuk melakukan pemesanan layanan.
            </Text>

            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#8a7a68"
              value={signupNama}
              onChangeText={setSignupNama}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#8a7a68"
              value={signupUsername}
              onChangeText={setSignupUsername}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#8a7a68"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
              <Text style={styles.submitButtonText}>Daftar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setScreen("login")}
            >
              <Text style={styles.backButtonText}>Kembali ke Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "admin" && isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.orderContainer}>
          <Text style={styles.orderTitle}>Admin Dashboard</Text>

          <Text style={styles.orderSubtitle}>
            Kelola semua pesanan dan ubah status pengerjaan.
          </Text>

          <View style={styles.adminSummary}>
            <Text style={styles.adminSummaryText}>
              Total Pesanan: {riwayatPesanan.length}
            </Text>
          </View>

          {riwayatPesanan.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
              <Text style={styles.emptyText}>
                Pesanan user akan tampil di halaman admin setelah dibuat.
              </Text>
            </View>
          ) : (
            riwayatPesanan.map((item, index) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>
                    Pesanan #{riwayatPesanan.length - index}
                  </Text>
                  <Text style={[styles.historyStatus, getStatusStyle(item.status)]}>
                    {item.status}
                  </Text>
                </View>

                <Text style={styles.historyText}>User: {item.username}</Text>
                <Text style={styles.historyText}>Nama: {item.nama}</Text>
                <Text style={styles.historyText}>Layanan: {item.layanan}</Text>
                <Text style={styles.historyText}>Jumlah: {item.jumlah}</Text>
                <Text style={styles.historyText}>File: {item.namaFile || "-"}</Text>
                {item.fileUrl ? (
                  <TouchableOpacity
                    style={styles.fileOpenButton}
                    onPress={() => Linking.openURL(item.fileUrl)}
                  >
                    <Text style={styles.fileOpenButtonText}>Buka File</Text>
                  </TouchableOpacity>
                ) : null}
                <Text style={styles.historyText}>
                  Tanggal: {item.tanggal} • {item.waktu}
                </Text>
                <Text style={styles.historyText}>
                  Catatan: {item.catatan || "-"}
                </Text>
                <Text style={styles.historyTotal}>
                  Total: Rp{item.total.toLocaleString("id-ID")}
                </Text>

                <View style={styles.adminButtonRow}>
                  <TouchableOpacity
                    style={styles.smallProcessButton}
                    onPress={() => updateStatusPesanan(item.id, "Sedang Diproses")}
                  >
                    <Text style={styles.smallButtonText}>Proses</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.smallDoneButton}
                    onPress={() => updateStatusPesanan(item.id, "Selesai")}
                  >
                    <Text style={styles.smallButtonText}>Selesai</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.smallCancelButton}
                    onPress={() => updateStatusPesanan(item.id, "Dibatalkan")}
                  >
                    <Text style={styles.smallButtonText}>Batalkan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.dangerButton} onPress={logout}>
            <Text style={styles.dangerButtonText}>Logout Admin</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "layanan") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.serviceContainer}>
          <Text style={styles.serviceTitle}>Layanan Inkfinity</Text>

          <Text style={styles.serviceSubtitle}>
            Pilih layanan fotocopy dan print sesuai kebutuhan kamu.
          </Text>

          <View style={styles.serviceList}>
            {layanan.map((item, index) => (
              <View key={index} style={styles.serviceCard}>
                <View style={styles.serviceTop}>
                  <View style={styles.serviceIconBox}>
                    <Text style={styles.serviceIcon}>{item.icon}</Text>
                  </View>

                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.nama}</Text>
                    <Text style={styles.servicePrice}>{item.labelHarga}</Text>
                  </View>
                </View>

                <Text style={styles.serviceDesc}>{item.deskripsi}</Text>

                <TouchableOpacity
                  style={styles.chooseButton}
                  onPress={() => {
                    setSelectedService(item.nama);
                    setScreen("order");
                  }}
                >
                  <Text style={styles.chooseButtonText}>Pilih Layanan</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "order") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.orderContainer}>
          <Text style={styles.orderTitle}>Buat Pesanan</Text>

          <Text style={styles.orderSubtitle}>
            Isi data pesanan fotocopy atau print kamu.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Nama Pemesan</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama kamu"
              placeholderTextColor="#8a7a68"
              value={nama}
              onChangeText={setNama}
            />

            <Text style={styles.label}>Layanan Dipilih</Text>
            <View style={styles.selectedBox}>
              <Text style={styles.selectedText}>{selectedData.nama}</Text>
              <Text style={styles.selectedPrice}>{selectedData.labelHarga}</Text>
            </View>

            <Text style={styles.label}>Jumlah</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 10"
              placeholderTextColor="#8a7a68"
              value={jumlah}
              onChangeText={setJumlah}
              keyboardType="numeric"
            />

<Text style={styles.label}>File Dokumen</Text>

<View style={styles.filePickerBox}>
  <View style={styles.fileInfo}>
    <Text style={styles.fileTitle}>
      {namaFile ? namaFile : "Belum ada file dipilih"}
    </Text>
    <Text style={styles.fileSubtitle}>PDF, DOC, DOCX, JPG, PNG</Text>
  </View>

  <TouchableOpacity style={styles.fileButton} onPress={pilihFile}>
    <Text style={styles.fileButtonText}>
      {namaFile ? "Ganti File" : "Pilih File"}
    </Text>
  </TouchableOpacity>
</View>

            

            <View style={styles.estimateBox}>
              <Text style={styles.estimateLabel}>Estimasi Total</Text>
              <Text style={styles.estimateValue}>
                Rp{estimasiTotal.toLocaleString("id-ID")}
              </Text>
            </View>

            <Text style={styles.label}>Catatan Pesanan</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Contoh: print bolak-balik, jilid biru, dll"
              placeholderTextColor="#8a7a68"
              value={catatan}
              onChangeText={setCatatan}
              multiline
            />

            <TouchableOpacity style={styles.submitButton} onPress={buatPesanan}>
              <Text style={styles.submitButtonText}>Kirim Pesanan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("layanan")}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "detail" && pesanan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.orderContainer}>
          <Text style={styles.orderTitle}>Detail Pesanan</Text>

          <View style={styles.detailCard}>
            <Text style={styles.successText}>Pesanan Berhasil Dibuat</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nama</Text>
              <Text style={styles.detailValue}>{pesanan.nama}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Layanan</Text>
              <Text style={styles.detailValue}>{pesanan.layanan}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Jumlah</Text>
              <Text style={styles.detailValue}>{pesanan.jumlah}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>File</Text>
              <Text style={styles.detailValue}>{pesanan.namaFile || "-"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total</Text>
              <Text style={styles.detailValue}>
                Rp{pesanan.total.toLocaleString("id-ID")}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal</Text>
              <Text style={styles.detailValue}>{pesanan.tanggal}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.statusText, getStatusStyle(pesanan.status)]}>
                {pesanan.status}
              </Text>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.detailLabel}>Catatan</Text>
              <Text style={styles.noteText}>{pesanan.catatan || "-"}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("history")}
          >
            <Text style={styles.primaryButtonText}>Lihat Riwayat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === "history") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.orderContainer}>
          <Text style={styles.orderTitle}>Riwayat Pemesanan</Text>

          <Text style={styles.orderSubtitle}>
            Daftar pesanan kamu beserta status pengerjaannya.
          </Text>

          {riwayatUser.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
              <Text style={styles.emptyText}>
                Silakan pilih layanan terlebih dahulu untuk membuat pesanan.
              </Text>
            </View>
          ) : (
            riwayatUser.map((item, index) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>
                    Pesanan #{riwayatUser.length - index}
                  </Text>
                  <Text style={[styles.historyStatus, getStatusStyle(item.status)]}>
                    {item.status}
                  </Text>
                </View>

                <Text style={styles.historyText}>Nama: {item.nama}</Text>
                <Text style={styles.historyText}>Layanan: {item.layanan}</Text>
                <Text style={styles.historyText}>Jumlah: {item.jumlah}</Text>
                <Text style={styles.historyText}>File: {item.namaFile || "-"}</Text>
                {item.fileUrl ? (
                  <TouchableOpacity
                    style={styles.fileOpenButton}
                    onPress={() => Linking.openURL(item.fileUrl)}
                  >
                    <Text style={styles.fileOpenButtonText}>Buka File</Text>
                  </TouchableOpacity>
                ) : null}
                <Text style={styles.historyText}>
                  Tanggal: {item.tanggal || "-"} • {item.waktu || "-"}
                </Text>
                <Text style={styles.historyText}>
                  Catatan: {item.catatan || "-"}
                </Text>
                <Text style={styles.historyTotal}>
                  Total: Rp{item.total.toLocaleString("id-ID")}
                </Text>

                <TouchableOpacity
                  style={styles.deleteOneButton}
                  onPress={() => hapusSatuPesanan(item.id)}
                >
                  <Text style={styles.deleteOneText}>Hapus Pesanan Ini</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("layanan")}
          >
            <Text style={styles.primaryButtonText}>Buat Pesanan Baru</Text>
          </TouchableOpacity>

          {riwayatUser.length > 0 && (
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={hapusRiwayatUser}
            >
              <Text style={styles.dangerButtonText}>Hapus Semua Riwayat</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>INKFINITY</Text>

        <View style={styles.userBadge}>
          <Text style={styles.userBadgeText}>
            Halo, {currentUser?.nama || "User"}
          </Text>
        </View>

        <View style={styles.circle}>
          <Image
            source={require("./assets/kucing_modi.png")}
            style={styles.catImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.tagline}>solusi cepat fotocopy dan print</Text>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("layanan")}
          >
            <Text style={styles.primaryButtonText}>Lihat Layanan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setScreen("history")}
          >
            <Text style={styles.secondaryButtonText}>Riwayat Pemesanan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={logout}>
            <Text style={styles.dangerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Cepat • Mudah • Praktis</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3e3d0",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#f3e3d0",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 35,
  },

  authContainer: {
    flexGrow: 1,
    backgroundColor: "#f3e3d0",
    paddingHorizontal: 24,
    paddingTop: 55,
    paddingBottom: 35,
    justifyContent: "center",
  },

  authCard: {
    backgroundColor: "#ead8c3",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#d5bfa6",
  },

  authTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 30,
    color: "#3B3B3B",
    textAlign: "center",
    marginBottom: 6,
  },

  authSubtitle: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 15,
    color: "#3B3B3B",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },

  adminInfoBox: {
    marginTop: 18,
    backgroundColor: "#f3e3d0",
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d5bfa6",
  },

  adminInfoTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 16,
    color: "#3B3B3B",
    marginBottom: 4,
  },

  adminInfoText: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 15,
    color: "#3B3B3B",
  },

  title: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 48,
    color: "#3B3B3B",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 18,
  },

  userBadge: {
    backgroundColor: "#ead8c3",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#d5bfa6",
  },

  userBadgeText: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 15,
    color: "#3B3B3B",
  },

  circle: {
    width: 220,
    height: 220,
    backgroundColor: "#d5bfa6",
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 55,
  },

  catImage: {
    width: 175,
    height: 150,
    marginTop: 5,
  },

  tagline: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 19,
    color: "#3B3B3B",
    textAlign: "center",
    lineHeight: 27,
    marginBottom: 35,
  },

  buttonWrapper: {
    width: "100%",
    marginTop: 5,
  },

  primaryButton: {
    backgroundColor: "#3B3B3B",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 13,
    width: "100%",
  },

  primaryButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 17,
  },

  secondaryButton: {
    backgroundColor: "#d5bfa6",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#3B3B3B",
    marginTop: 10,
    marginBottom: 13,
  },

  secondaryButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#3B3B3B",
    fontSize: 17,
  },

  footer: {
    marginTop: 55,
    fontFamily: "CrimsonText_400Regular",
    fontSize: 14,
    color: "#3B3B3B",
  },

  serviceContainer: {
    flexGrow: 1,
    backgroundColor: "#f3e3d0",
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 35,
  },

  serviceTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 38,
    color: "#3B3B3B",
    textAlign: "center",
    marginBottom: 8,
  },

  serviceSubtitle: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },

  serviceList: {
    width: "100%",
  },

  serviceCard: {
    backgroundColor: "#ead8c3",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d5bfa6",
  },

  serviceTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  serviceIconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#f3e3d0",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  serviceIcon: {
    fontSize: 27,
  },

  serviceInfo: {
    flex: 1,
  },

  serviceName: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 20,
    color: "#3B3B3B",
  },

  servicePrice: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 15,
    color: "#3B3B3B",
    marginTop: 1,
  },

  serviceDesc: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 14,
    color: "#3B3B3B",
    lineHeight: 20,
    marginBottom: 13,
  },

  chooseButton: {
    backgroundColor: "#3B3B3B",
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
  },

  chooseButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 15,
  },

  backButton: {
    backgroundColor: "#d5bfa6",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#3B3B3B",
    marginTop: 15,
    width: "100%",
  },

  backButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#3B3B3B",
    fontSize: 17,
  },

  orderContainer: {
    flexGrow: 1,
    backgroundColor: "#f3e3d0",
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 35,
  },

  orderTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 38,
    color: "#3B3B3B",
    textAlign: "center",
    marginBottom: 8,
  },

  orderSubtitle: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },

  formCard: {
    backgroundColor: "#ead8c3",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#d5bfa6",
  },

  label: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 17,
    color: "#3B3B3B",
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#f3e3d0",
    borderWidth: 1,
    borderColor: "#d5bfa6",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    marginBottom: 15,
  },

  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  selectedBox: {
    backgroundColor: "#f3e3d0",
    borderWidth: 1,
    borderColor: "#d5bfa6",
    borderRadius: 15,
    padding: 14,
    marginBottom: 15,
  },

  selectedText: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 18,
    color: "#3B3B3B",
  },

  selectedPrice: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 15,
    color: "#3B3B3B",
    marginTop: 2,
  },

filePickerBox: {
  backgroundColor: "#f3e3d0",
  borderWidth: 1,
  borderColor: "#d5bfa6",
  borderRadius: 15,
  padding: 14,
  marginBottom: 15,
},

fileInfo: {
  marginBottom: 12,
},

fileTitle: {
  fontFamily: "CrimsonText_700Bold",
  fontSize: 16,
  color: "#3B3B3B",
},

fileSubtitle: {
  fontFamily: "CrimsonText_400Regular",
  fontSize: 14,
  color: "#8a7a68",
  marginTop: 3,
},

fileButton: {
  backgroundColor: "#3B3B3B",
  paddingVertical: 12,
  borderRadius: 14,
  alignItems: "center",
},

fileButtonText: {
  fontFamily: "CrimsonText_700Bold",
  color: "#FFFFFF",
  fontSize: 15,
},

  estimateBox: {
    backgroundColor: "#f3e3d0",
    borderRadius: 15,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d5bfa6",
    marginBottom: 15,
  },

  estimateLabel: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 15,
    color: "#3B3B3B",
  },

  estimateValue: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 24,
    color: "#3B3B3B",
    marginTop: 3,
  },

  submitButton: {
    backgroundColor: "#3B3B3B",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 5,
  },

  submitButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 17,
  },

  detailCard: {
    backgroundColor: "#ead8c3",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#d5bfa6",
    marginBottom: 18,
  },

  successText: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 22,
    color: "#3B3B3B",
    textAlign: "center",
    marginBottom: 18,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#d5bfa6",
    paddingVertical: 10,
    gap: 10,
  },

  detailLabel: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 16,
    color: "#3B3B3B",
  },

  detailValue: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    textAlign: "right",
    flex: 1,
  },

  statusText: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 16,
  },

  statusMenunggu: {
    color: "#92400e",
  },

  statusProses: {
    color: "#1d4ed8",
  },

  statusSelesai: {
    color: "#15803d",
  },

  statusBatal: {
    color: "#b91c1c",
  },

  noteBox: {
    marginTop: 12,
  },

  noteText: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    marginTop: 4,
  },

  emptyCard: {
    backgroundColor: "#ead8c3",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#d5bfa6",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 22,
    color: "#3B3B3B",
    marginBottom: 8,
  },

  emptyText: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    textAlign: "center",
    lineHeight: 22,
  },

  historyCard: {
    backgroundColor: "#ead8c3",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d5bfa6",
    marginBottom: 14,
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },

  historyTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 19,
    color: "#3B3B3B",
  },

  historyStatus: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 14,
    textAlign: "right",
  },

  historyText: {
    fontFamily: "CrimsonText_400Regular",
    fontSize: 16,
    color: "#3B3B3B",
    marginBottom: 3,
  },

  historyTotal: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 17,
    color: "#3B3B3B",
    marginTop: 5,
  },

  fileOpenButton: {
    backgroundColor: "#3B3B3B",
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  fileOpenButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 14,
  },

  adminSummary: {
    backgroundColor: "#ead8c3",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d5bfa6",
    marginBottom: 16,
  },

  adminSummaryText: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 19,
    color: "#3B3B3B",
    textAlign: "center",
  },

  adminButtonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  smallProcessButton: {
    flex: 1,
    backgroundColor: "#1d4ed8",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  smallDoneButton: {
    flex: 1,
    backgroundColor: "#15803d",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  smallCancelButton: {
    flex: 1,
    backgroundColor: "#b91c1c",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  smallButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 13,
  },

  deleteOneButton: {
    backgroundColor: "#d5bfa6",
    borderWidth: 1,
    borderColor: "#3B3B3B",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  deleteOneText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#3B3B3B",
    fontSize: 14,
  },

  dangerButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 2,
    marginBottom: 13,
    width: "100%",
  },

  dangerButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 17,
  },
});
