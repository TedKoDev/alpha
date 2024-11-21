import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';

import { useAuthStore } from '~/store/authStore';

export default function MyPage() {
  const { logout, userInfo, updateUserInfo } = useAuthStore();

  console.log(userInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    bio: userInfo?.bio || '',
    profile_picture_url: userInfo?.profile_picture_url || '',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please grant camera roll permissions to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedProfile((prev) => ({
        ...prev,
        profile_picture_url: result.assets[0].uri,
      }));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // API call to update profile would go here
      await updateUserInfo(editedProfile);
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'My Page' }} />
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: userInfo?.profile_picture_url || 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo?.username || 'Student'}</Text>
            <Text style={styles.rankText}>Lv {userInfo?.level || 1}</Text>
            <Text style={styles.userEmail}>{userInfo?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Points Section */}
        <TouchableOpacity style={styles.pointsSection}>
          <Text style={styles.pointsText}>🎯 Learning Points</Text>
          <Text style={styles.pointsCount}>{userInfo?.points || 0} pts</Text>
        </TouchableOpacity>

        {/* Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>{userInfo?.stats?.postCount || 0}</Text>
            <Text style={styles.activityLabel}>Posts</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>{userInfo?.stats?.commentCount || 0}</Text>
            <Text style={styles.activityLabel}>Comments</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>{userInfo?.stats?.followersCount || 0}</Text>
            <Text style={styles.activityLabel}>Followers</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>{userInfo?.stats?.followingCount || 0}</Text>
            <Text style={styles.activityLabel}>Following</Text>
          </View>
        </View>

        {/* Learning Section */}
        <View style={styles.tradeSection}>
          <TouchableOpacity style={styles.tradeItem}>
            <FontAwesome5 name="book" size={24} color="black" />
            <Text style={styles.tradeLabel}>My Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tradeItem}>
            <FontAwesome5 name="history" size={24} color="black" />
            <Text style={styles.tradeLabel}>Learning History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tradeItem}>
            <FontAwesome5 name="comments" size={24} color="black" />
            <Text style={styles.tradeLabel}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tradeItem}>
            <FontAwesome5 name="bookmark" size={24} color="black" />
            <Text style={styles.tradeLabel}>Bookmarks</Text>
          </TouchableOpacity>
        </View>

        {/* Other Section */}
        <View style={styles.otherSection}>
          <TouchableOpacity style={styles.otherItem}>
            <FontAwesome5 name="bullhorn" size={24} color="black" />
            <Text style={styles.otherLabel}>Announcements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherItem}>
            <FontAwesome5 name="headset" size={24} color="black" />
            <Text style={styles.otherLabel}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherItem}>
            <FontAwesome5 name="user-plus" size={24} color="black" />
            <Text style={styles.otherLabel}>Become a Teacher</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button title="Logout" onPress={logout} color="#FF0000" />

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              {/* Profile Image Section */}
              <View style={styles.profileImageSection}>
                <Image
                  source={{
                    uri: editedProfile.profile_picture_url || 'https://via.placeholder.com/100',
                  }}
                  style={styles.modalProfileImage}
                />
                <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.username}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, username: text }))}
                  placeholder="Enter username"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, email: text }))}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
                  placeholder="Enter bio"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateProfile}>
                  <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 14,
    color: '#ffa500',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  editProfileButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  editProfileText: {
    fontSize: 12,
    color: '#007bff',
  },
  pointsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#e7f0fc',
    borderRadius: 12,
    marginBottom: 16,
  },
  pointsText: {
    fontSize: 16,
  },
  pointsCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activitySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
  },
  activityItem: {
    alignItems: 'center',
  },
  activityNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 12,
    color: '#666',
  },
  tradeSection: {
    marginBottom: 16,
  },
  tradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tradeLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  otherSection: {
    marginBottom: 16,
  },
  otherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  otherLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  changePhotoText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
});
