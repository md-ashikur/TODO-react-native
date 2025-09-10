import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GetStart from '../GetStart';


export default function HomeScreen() {
  return (
   <SafeAreaView style={styles.getStarted} >
     <GetStart />
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  getStarted: {
    flex: 1,
    marginTop: 20,
  },
});
