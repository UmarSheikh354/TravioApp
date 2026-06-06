import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors } from "@/lib/theme";
import { useApp } from "@/context/AppContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  onNewChat?: () => void;
};

export function AppSidebar({ visible, onClose, onNewChat }: Props) {
  const { logout, user } = useApp();

  async function handleLogout() {
    await logout();
    onClose();
    router.replace("/login");
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          <Pressable
            style={styles.newChat}
            onPress={() => {
              onNewChat?.();
              onClose();
              router.push("/chat");
            }}
          >
            <Text style={styles.newChatText}>＋ New Chat</Text>
          </Pressable>
          <TextInput placeholder="Search chats" placeholderTextColor="#777" style={styles.search} />
          <SidebarSection title="Today" items={["Find wireless earbuds", "Compare smart watches"]} />
          <SidebarSection title="Yesterday" items={["Best deals today", "Search Alibaba suppliers"]} />
          <SidebarSection title="Previous" items={["Office chairs under $100", "Phone cases bulk order"]} />
          <SidebarSection title="Saved Products" items={["Saved product grid"]} onItemPress={() => router.push("/saved")} />

          <View style={styles.footer}>
            <Pressable style={styles.footerRow} onPress={() => router.push("/(tabs)/profile")}>
              <Text style={styles.footerText}>⚙ Settings</Text>
            </Pressable>
            <View style={styles.profile}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(user?.name ?? "T").slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={styles.profileTextWrap}>
                <Text style={styles.profileName}>{user?.name ?? "Travio User"}</Text>
                <Text style={styles.profileEmail}>{user?.email ?? "guest@travio.local"}</Text>
              </View>
            </View>
            <Pressable style={styles.logout} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.scrim} onPress={onClose} />
      </View>
    </Modal>
  );
}

function SidebarSection({ title, items, onItemPress }: { title: string; items: string[]; onItemPress?: () => void }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <Pressable key={item} style={styles.item} onPress={onItemPress}>
          <Text style={styles.itemText}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row"
  },
  sidebar: {
    backgroundColor: colors.sidebar,
    gap: 14,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 58,
    width: "78%"
  },
  scrim: {
    backgroundColor: "rgba(0,0,0,0.25)",
    flex: 1
  },
  newChat: {
    backgroundColor: colors.control,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  newChatText: {
    color: colors.inverseText,
    fontWeight: "800"
  },
  search: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    minHeight: 42,
    paddingHorizontal: 12
  },
  section: {
    gap: 5
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  item: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  itemText: {
    color: colors.text,
    fontSize: 13
  },
  footer: {
    gap: 10,
    marginTop: "auto"
  },
  footerRow: {
    paddingVertical: 8
  },
  footerText: {
    color: colors.text,
    fontWeight: "700"
  },
  profile: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.control,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  avatarText: {
    color: colors.inverseText,
    fontWeight: "900"
  },
  profileTextWrap: {
    flex: 1
  },
  profileName: {
    color: colors.text,
    fontWeight: "800"
  },
  profileEmail: {
    color: colors.muted,
    fontSize: 11
  },
  logout: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    padding: 10
  },
  logoutText: {
    color: colors.text,
    fontWeight: "700",
    textAlign: "center"
  }
});
