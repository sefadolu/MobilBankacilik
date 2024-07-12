import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 

const HesapHareketleri = ({ transactions, accountName }) => {
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(new Date()); 
  const [showStartDatePicker, setShowStartDatePicker] = useState(false); 
  const [showEndDatePicker, setShowEndDatePicker] = useState(false); 

  // Tarih seçiciyi açma işlevi
  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  // Tarih seçiciyi kapama işlevi
  const hideStartDatePickerModal = () => {
    setShowStartDatePicker(false);
  };

  const hideEndDatePickerModal = () => {
    setShowEndDatePicker(false);
  };

  // Tarihleri güncelleme işlevi
  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    hideStartDatePickerModal();
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    hideEndDatePickerModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hesap Adı: {accountName}  </Text>
       <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={showStartDatePickerModal} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>Başlangıç Tarihi Seç</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showEndDatePickerModal} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>Bitiş Tarihi Seç</Text>
        </TouchableOpacity>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}


      {transactions && transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.transactionId}
          renderItem={({ item }) => (
            <View style={styles.transactionContainer}>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={styles.transactionDescription}>{item.description}</Text>
              <Text style={styles.transactionAmount}>
                Tutar: {item.amount} {item.currency}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransactions}>Hesap hareketi bulunamadı.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  datePickerButtonText: {
    color: 'blue', 
    fontSize: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  transactionContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginBottom: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: 'gray',
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 16,
    marginTop: 5,
  },
  noTransactions: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dateFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  datePicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginRight: 10,
  },
});

export default HesapHareketleri;
