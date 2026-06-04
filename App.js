import React, { useEffect, useState } from "react";
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
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFonts } from "expo-font";
import {
  CrimsonText_400Regular,
  CrimsonText_700Bold,
} from "@expo-google-fonts/crimson-text";

const STORAGE_KEY = "INKFINITY_RIWAYAT_PESANAN";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedService, setSelectedService] = useState("Print Hitam Putih");
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [pesanan, setPesanan] = useState(null);
  const [riwayatPesanan, setRiwayatPesanan] = useState([]);

  const [fontsLoaded] = useFonts({
    CrimsonText_400Regular,
    CrimsonText_700Bold,
  });

  useEffect(() => {
    ambilRiwayatPesanan();
  }, []);

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

  const hapusRiwayatPesanan = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setRiwayatPesanan([]);
      Alert.alert("Berhasil", "Riwayat pesanan berhasil dihapus.");
    } catch (error) {
      console.log("Gagal menghapus riwayat pesanan:", error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

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

  const buatPesanan = async () => {
    if (nama.trim() === "" || jumlah.trim() === "") {
      Alert.alert("Peringatan", "Nama dan jumlah harus diisi.");
      return;
    }

    if (isNaN(Number(jumlah)) || Number(jumlah) <= 0) {
      Alert.alert("Peringatan", "Jumlah harus berupa angka yang valid.");
      return;
    }

    const total = selectedData.harga * Number(jumlah);

    const dataPesanan = {
      id: Date.now(),
      nama,
      layanan: selectedData.nama,
      jumlah,
      total,
      catatan,
      status: "Menunggu Diproses",
      tanggal: new Date().toLocaleDateString("id-ID"),
    };

    const riwayatBaru = [dataPesanan, ...riwayatPesanan];

    setPesanan(dataPesanan);
    setRiwayatPesanan(riwayatBaru);
    await simpanRiwayatPesanan(riwayatBaru);

    setNama("");
    setJumlah("");
    setCatatan("");

    setScreen("detail");
  };

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
              <Text style={styles.statusText}>{pesanan.status}</Text>
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
            Daftar pesanan yang sudah tersimpan di database lokal.
          </Text>

          {riwayatPesanan.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
              <Text style={styles.emptyText}>
                Silakan pilih layanan terlebih dahulu untuk membuat pesanan.
              </Text>
            </View>
          ) : (
            riwayatPesanan.map((item, index) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>
                    Pesanan #{riwayatPesanan.length - index}
                  </Text>
                  <Text style={styles.historyStatus}>{item.status}</Text>
                </View>

                <Text style={styles.historyText}>Nama: {item.nama}</Text>
                <Text style={styles.historyText}>Layanan: {item.layanan}</Text>
                <Text style={styles.historyText}>Jumlah: {item.jumlah}</Text>
                <Text style={styles.historyText}>
                  Tanggal: {item.tanggal || "-"}
                </Text>
                <Text style={styles.historyTotal}>
                  Total: Rp{item.total.toLocaleString("id-ID")}
                </Text>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("layanan")}
          >
            <Text style={styles.primaryButtonText}>Buat Pesanan Baru</Text>
          </TouchableOpacity>

          {riwayatPesanan.length > 0 && (
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={hapusRiwayatPesanan}
            >
              <Text style={styles.dangerButtonText}>Hapus Riwayat</Text>
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
    paddingTop: 65,
    paddingBottom: 35,
  },

  title: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 48,
    color: "#3B3B3B",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 22,
  },

  circle: {
    width: 220,
    height: 220,
    backgroundColor: "#d5bfa6",
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 70,
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
    marginBottom: 45,
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
  },

  secondaryButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#3B3B3B",
    fontSize: 17,
  },

  footer: {
    marginTop: 80,
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
  },

  statusText: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 16,
    color: "#3B3B3B",
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
  },

  historyTitle: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 19,
    color: "#3B3B3B",
  },

  historyStatus: {
    fontFamily: "CrimsonText_700Bold",
    fontSize: 14,
    color: "#3B3B3B",
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

  dangerButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 2,
    width: "100%",
  },

  dangerButtonText: {
    fontFamily: "CrimsonText_700Bold",
    color: "#FFFFFF",
    fontSize: 17,
  },
});