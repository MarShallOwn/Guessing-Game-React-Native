import React, { useState, useRef, useEffect } from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import NumberContainer from '../components/NumberContainer';
import Card from '../components/Card';
import Colors from '../constants/colors';

const generateRandomBetween = (min, max, exclude) => {
    min = Math.ceil(min);
    max= Math.floor(max);
    const rndNum = Math.floor(Math.random() * (max - min)) + min;

    if(rndNum === exclude){
        return generateRandomBetween(min, max, exclude);
    }
    else{
        return rndNum;
    }
};


const GameScreen = props => {

    const [currentGuess, setCurrentGuess] = useState(generateRandomBetween(1, 100, props.userChoice));
    const [rounds, setRounds] = useState(0);

    const currentLow = useRef(1);
    const currentHigh = useRef(100);

    const {userChoice, onGameOver} = props;

    useEffect(()=>{
        if(currentGuess === userChoice){
            onGameOver(rounds);
        }
    }, [currentGuess, userChoice, onGameOver])

    const nextGuessHandler = direction => {
        if( (direction === 'lower' && props.userChoice > currentGuess) || (direction === 'greater' && props.userChoice < currentGuess) ){
            Alert.alert('Liar', `Dont lie we know it isnt ${direction}`, [{text: 'I am sorry', style: 'cancel'}]);
            return;
        }
        if(direction === 'lower'){
            currentHigh.current = currentGuess;
        }
        else{
            currentLow.current = currentGuess;
        }
        const nextNumber = generateRandomBetween(currentLow.current, currentHigh.current, currentGuess);
        setCurrentGuess(nextNumber);
        setRounds(currRounds => currRounds + 1);
    }

    return(
        <View style={styles.screen}>
            <View style={styles.guessContainer}>
                <View style={styles.eachGuessContainer}>
                    <Text>Your Guess</Text>
                    <NumberContainer style={{borderColor: Colors.primary, color: Colors.primary}}>{props.userChoice}</NumberContainer>
                </View>
                <View style={styles.eachGuessContainer}>
                    <Text>Computer's Guess</Text>
                    <NumberContainer>{currentGuess}</NumberContainer>
                </View>
            </View>
            
            <Card style={styles.buttonContainer}>
                <Button title="LOWER" onPress={ () =>{nextGuessHandler('lower')} } />
                <Button title="GREATER" onPress={ () =>{nextGuessHandler('greater')} } />
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        padding: 10,
        alignItems: 'center'
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: 300,
        maxHeight: '80%'
    },
    guessContainer:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        width: '70%',
    },
    eachGuessContainer:{
        alignItems: 'center'
    }
})

export default GameScreen;