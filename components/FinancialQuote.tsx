import {View, Text, StyleSheet} from 'react-native';
import {useAppTheme} from '@/constants/theme';

const quotes = [
  {
    text: 'Pieniądze nie spadają z nieba, muszą być zarobione na ziemi.',
    author: 'Margaret Thatcher',
  },
  {
    text: 'Jak się nie ma miedzi, to się w domu siedzi.',
    author: 'Autor nieznany',
  },
  {
    text: 'Pieniądze szczęścia nie dają, ale lepiej płakać w Porsche niż w autobusie.',
    author: 'Autor nieznany',
  },
  {
    text: 'Kupujemy rzeczy, których nie potrzebujemy, za pieniądze, których nie mamy, żeby zaimponować ludziom, na których nam nie zależy.',
    author: 'Will Smith',
  },
  {
    text: 'Pieniądze nie są ważne. Są potrzebne.',
    author: 'Aleksandra P. z bloga Marcina Iwucia',
  },
  {
    text: 'Pieniądze nie są tak dobre, jak zły jest ich brak.',
    author: 'Przysłowie żydowskie',
  },
  {
    text: 'Pieniądze ułatwiają znoszenie ubóstwa.',
    author: 'Alphonse Allais',
  },
  {
    text: 'Pieniądze nie dają szczęścia, ale pozwalają łatwiej znosić nieszczęścia.',
    author: 'Autor nieznany',
  },
  {
    text: 'Pieniądze są jak powietrze – nieważne, jeśli masz ich dosyć, ale rozpaczliwie ważne, gdy ich brakuje.',
    author: 'Terry Pratchett',
  },
  {
    text: 'Pieniądze nie mają żadnego znaczenia, ale dopiero wtedy, kiedy je masz.',
    author: 'Michał Wawrzyniak',
  },
  {
    text: 'Pieniądze szczęścia nie dają? Być może! Lecz kufereczek stóweczek daj Boże!',
    author: 'Danuta Rinn & Bogdan Czyżewski',
  },
  {
    text: 'Pieniądze nie są celem. Pieniądze nie mają wartości. Wartość mają marzenia, które pieniądze pomogą zrealizować.',
    author: 'Robert Kiyosaki',
  },
  {
    text: 'Nie odkładaj marzeń, odkładaj na marzenia.',
    author: 'Autor nieznany',
  },
  {
    text: 'Pieniądze nie dają szczęścia, ale mogą zapewnić niesamowity komfort w czasach nieszczęścia.',
    author: 'Clare B. Luce',
  },
  {
    text: 'Pieniądze nie dają szczęścia tylko tym, co ich nie mają.',
    author: 'Autor nieznany',
  },
  {
    text: 'Pieniądze nie dają szczęścia – to tylko głupie tłumaczenie ludzi, którzy tych pieniędzy nie mają.',
    author: 'Autor nieznany',
  },
  {
    text: 'Pieniądze nie dają szczęścia, ale mogę za nie kupić każdy wieżowiec w Nowym Jorku.',
    author: 'Andrew Carnegie',
  },
  {
    text: 'Pieniądze są przede wszystkim środkiem dla zapewnienia przyszłości.',
    author: 'M. Gallo',
  },
  {
    text: 'Pieniądze nie czynią człowieka szczęśliwym, ale niezwykle uspokajają.',
    author: 'Erich M. Remarque',
  },
  {
    text: 'Pieniądze, które mamy, są narzędziem wolności. Pieniądze, za którymi się uganiamy – narzędziem niewoli.',
    author: 'Jean-Jacques Rousseau',
  },
];

const FinancialQuote = () => {
  const t = useAppTheme();
  const today = new Date();
  const dayIndex = today.getDate() % quotes.length;

  return (
    <View style={styles.container}>
      <Text style={[styles.quote, {color: t.colors.onBackground}]}>
        {quotes[dayIndex].text}
      </Text>
      <Text style={[styles.author, {color: t.colors.onBackground}]}>
        — {quotes[dayIndex].author}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  author: {
    fontSize: 14,
    textAlign: 'right',
  },
});

export default FinancialQuote;