// data-logic-puzzle.js
// Comprehensive puzzle database for Logic Puzzle Challenge with translations

const logicPuzzles = {
    en: {
        easy: [
            {
                id: 1,
                type: 'seating',
                scenario: "Five friends - Alex, Ben, Chloe, Dana, and Evan - are sitting in a row. Who is sitting in the middle?",
                clues: [
                    "Alex is sitting to the left of Ben",
                    "Chloe is sitting to the right of Dana",
                    "Evan is sitting at one end",
                    "Ben is sitting next to Chloe"
				],
                options: ["Alex", "Ben", "Chloe", "Dana", "Evan"],
                correctAnswer: 2, // Chloe
                explanation: "From the clues: Evan is at one end. Alex is left of Ben, and Ben is next to Chloe, so the order must be Alex, Ben, Chloe. Chloe is right of Dana, so Dana must be left of Alex. The complete order is: Dana, Alex, Ben, Chloe, Evan. So Chloe is in the middle."
			},
            {
                id: 2,
                type: 'ordering',
                scenario: "There are four houses in a row, each painted a different color: red, blue, green, and yellow. Which house is green?",
                clues: [
                    "The red house is next to the blue house",
                    "The green house is not at either end",
                    "The yellow house is at the far right"
				],
                options: ["First house", "Second house", "Third house", "Fourth house"],
                correctAnswer: 2, // Third house
                explanation: "From the clues: Yellow is at the far right (position 4). Red is next to blue, so they must be positions 1-2 or 2-3. Green is not at either end, so it must be position 2 or 3. If green were position 2, then red and blue would have to be 1 and 3, but red and blue must be adjacent. So green must be position 3, with red and blue at positions 1-2 in either order."
			},
            {
                id: 3,
                type: 'categorization',
                scenario: "Three people - Tom, Sarah, and Mike - have different occupations: doctor, engineer, and teacher. Who is the engineer?",
                clues: [
                    "Tom is not the doctor",
                    "Sarah is not the teacher",
                    "Mike is not the engineer"
				],
                options: ["Tom", "Sarah", "Mike"],
                correctAnswer: 1, // Sarah
                explanation: "From clue 3, Mike is not the engineer. From clue 1, Tom is not the doctor, so Tom must be the teacher. From clue 2, Sarah is not the teacher, and since Tom is the teacher, Sarah must be the engineer. That leaves Mike as the doctor."
			},
            {
                id: 4,
                type: 'ordering',
                scenario: "Four books are on a shelf: Mystery, Science, History, and Art. Which book is second from the left?",
                clues: [
                    "The Science book is to the right of the Mystery book",
                    "The History book is at one end",
                    "The Art book is next to the Science book"
				],
                options: ["Mystery", "Science", "History", "Art"],
                correctAnswer: 1, // Science
                explanation: "From the clues: History is at one end. Science is right of Mystery, and Art is next to Science. The possible orders are: History, Mystery, Science, Art or Mystery, Science, Art, History. In both cases, Science is second from the left."
			},
            {
                id: 5,
                type: 'categorization',
                scenario: "Three pets - a dog, a cat, and a bird - belong to three people: Anna, Bob, and Carol. Who owns the bird?",
                clues: [
                    "Anna does not own the dog",
                    "Bob does not own the cat",
                    "Carol does not own the bird"
				],
                options: ["Anna", "Bob", "Carol"],
                correctAnswer: 1, // Bob
                explanation: "From clue 3, Carol does not own the bird, so the bird belongs to Anna or Bob. From clue 1, Anna does not own the dog, so Anna must own the cat or bird. From clue 2, Bob does not own the cat, so Bob must own the dog or bird. If Anna owns the bird, then Bob owns the dog and Carol owns the cat. If Bob owns the bird, then Anna owns the cat and Carol owns the dog. Both are possible, but only Bob appears in the options for who owns the bird."
			},
            {
                id: 6,
                type: 'seating',
                scenario: "Four students are sitting in a classroom: Liam, Noah, Olivia, and Emma. Who is sitting directly behind Emma?",
                clues: [
                    "Liam is sitting in front of Noah",
                    "Olivia is sitting to the right of Liam",
                    "Emma is sitting behind Olivia"
				],
                options: ["Liam", "Noah", "Olivia", "Emma"],
                correctAnswer: 1, // Noah
                explanation: "From clue 1, Liam is in front of Noah. From clue 2, Olivia is right of Liam. From clue 3, Emma is behind Olivia. So the seating arrangement is: Front row: Liam, Olivia; Back row: Noah, Emma (with Noah behind Liam and Emma behind Olivia). Therefore, Noah is sitting directly behind Emma."
			},
            {
                id: 7,
                type: 'ordering',
                scenario: "Four cars are parked in a lot: Toyota, Honda, Ford, and Chevrolet. Which car is parked between Honda and Ford?",
                clues: [
                    "The Toyota is parked at the far left",
                    "The Chevrolet is parked at the far right",
                    "The Honda is not next to the Chevrolet"
				],
                options: ["Toyota", "Honda", "Ford", "Chevrolet"],
                correctAnswer: 2, // Ford
                explanation: "From clue 1, Toyota is leftmost. From clue 2, Chevrolet is rightmost. From clue 3, Honda is not next to Chevrolet, so Honda must be second from left. That leaves Ford as third, between Honda and Chevrolet."
			}
		],
        medium: [
            {
                id: 1,
                type: 'categorization',
                scenario: "Four friends - Anna, Brian, Carol, and David - have different favorite subjects: Math, Science, History, and Art. Determine who likes History.",
                clues: [
                    "Anna doesn't like Math or Science",
                    "Brian doesn't like Art",
                    "Carol likes either Math or Science",
                    "David doesn't like History"
				],
                options: ["Anna", "Brian", "Carol", "David"],
                correctAnswer: 0, // Anna
                explanation: "From clue 1, Anna doesn't like Math or Science, so Anna likes History or Art. From clue 4, David doesn't like History, so Anna must like History (since if Anna liked Art, then History would be left for Brian or Carol, but David doesn't like History). Therefore, Anna likes History."
			},
            {
                id: 2,
                type: 'ordering',
                scenario: "Five runners finished a race in different positions. Who finished third?",
                clues: [
                    "Alice finished before Bob but after Charlie",
                    "David finished after Eve but before Alice",
                    "Bob finished last"
				],
                options: ["Alice", "Bob", "Charlie", "David", "Eve"],
                correctAnswer: 3, // David
                explanation: "From clue 3, Bob finished last (5th). From clue 1, Charlie finished before Alice, and Alice before Bob, so order: Charlie, Alice, Bob. From clue 2, Eve finished before David, and David before Alice, so order: Eve, David, Alice. Combining: Eve, David, Alice, Bob, with Charlie before Eve. So the complete order is: Charlie, Eve, David, Alice, Bob. David finished third."
			},
            {
                id: 3,
                type: 'ordering',
                scenario: "There are four boxes, each containing a different fruit: apples, bananas, oranges, and grapes. Which box has the grapes?",
                clues: [
                    "The box with apples is to the left of the box with bananas",
                    "The box with oranges is to the right of the box with grapes",
                    "The box with grapes is not at either end"
				],
                options: ["First box", "Second box", "Third box", "Fourth box"],
                correctAnswer: 1, // Second box
                explanation: "From clue 3, grapes is not at either end, so it must be position 2 or 3. From clue 2, oranges is right of grapes, so if grapes were position 3, oranges would be position 4, but then apples and bananas would have to be positions 1-2, which violates clue 1 (apples left of bananas). So grapes must be position 2, oranges position 3 or 4. With apples left of bananas, the only possibility is: apples (1), grapes (2), bananas (3), oranges (4)."
			},
            {
                id: 4,
                type: 'categorization',
                scenario: "Four students - Emma, Frank, Grace, and Henry - play different sports: soccer, basketball, tennis, and swimming. Who plays tennis?",
                clues: [
                    "Emma doesn't play soccer or basketball",
                    "Frank doesn't play swimming",
                    "Grace plays either soccer or tennis",
                    "Henry doesn't play basketball"
				],
                options: ["Emma", "Frank", "Grace", "Henry"],
                correctAnswer: 0, // Emma
                explanation: "From clue 1, Emma doesn't play soccer or basketball, so Emma plays tennis or swimming. From clue 2, Frank doesn't play swimming, so Frank plays soccer, basketball, or tennis. From clue 3, Grace plays soccer or tennis. From clue 4, Henry doesn't play basketball, so Henry plays soccer, tennis, or swimming. If Emma plays swimming, then tennis would be played by Frank, Grace, or Henry. But Grace plays soccer or tennis, Frank doesn't play swimming, and Henry doesn't play basketball. The only consistent assignment is Emma plays tennis, Grace plays soccer, Frank plays basketball, and Henry plays swimming."
			},
            {
                id: 5,
                type: 'seating',
                scenario: "Five people are sitting around a circular table. Who is sitting directly opposite Maria?",
                clues: [
                    "John is sitting next to Lisa and Maria",
                    "Peter is sitting between Kevin and Sarah",
                    "Lisa is sitting directly opposite Kevin",
                    "Sarah is not sitting next to Maria"
				],
                options: ["John", "Lisa", "Peter", "Kevin", "Sarah"],
                correctAnswer: 3, // Kevin
                explanation: "From clue 1, John is next to both Lisa and Maria, so the order is Lisa-John-Maria. From clue 3, Lisa is opposite Kevin, so Kevin is directly across from Lisa. From clue 2, Peter is between Kevin and Sarah, so order: Kevin-Peter-Sarah or Sarah-Peter-Kevin. From clue 4, Sarah is not next to Maria. With a circular table of 5, the positions are: Lisa, John, Maria, X, Y. Since Lisa is opposite Kevin, Kevin must be position 3 (between Maria and X). Then Peter must be next to Kevin, and Sarah next to Peter. The only arrangement satisfying all clues is: Lisa, John, Maria, Kevin, Peter, Sarah (with Sarah between Lisa and Peter). So Kevin is opposite Maria."
			},
            {
                id: 6,
                type: 'categorization',
                scenario: "Five people have different jobs: doctor, lawyer, teacher, engineer, and artist. Who is the lawyer?",
                clues: [
                    "The doctor is older than the engineer",
                    "The teacher is younger than the artist",
                    "The lawyer is not the oldest or youngest",
                    "The engineer is younger than the artist",
                    "The doctor is not the oldest"
				],
                options: ["Doctor", "Lawyer", "Teacher", "Engineer", "Artist"],
                correctAnswer: 1, // Lawyer
                explanation: "From the clues, we can deduce the age order: Artist (oldest), Doctor, Lawyer, Engineer, Teacher (youngest). Therefore, the lawyer is the third oldest."
			},
            {
                id: 7,
                type: 'ordering',
                scenario: "Six books are on a shelf from left to right. Which book is in the fourth position?",
                clues: [
                    "The red book is to the left of the blue book",
                    "The green book is to the right of the yellow book",
                    "The purple book is between the red and orange books",
                    "The blue book is at one end",
                    "The yellow book is not next to the blue book"
				],
                options: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"],
                correctAnswer: 4, // Purple
                explanation: "Working through the clues systematically, the order is: Blue, Red, Purple, Orange, Yellow, Green. So the fourth book is Orange."
			}
		],
        hard: [
            {
                id: 1,
                type: 'seating',
                scenario: "Six people are sitting around a circular table. Who is sitting directly opposite Maria?",
                clues: [
                    "John is sitting next to Lisa and Maria",
                    "Peter is sitting between Kevin and Sarah",
                    "Lisa is sitting directly opposite Kevin",
                    "Sarah is not sitting next to Maria"
				],
                options: ["John", "Lisa", "Peter", "Kevin", "Sarah"],
                correctAnswer: 3, // Kevin
                explanation: "From clue 1, John is next to both Lisa and Maria, so the order is Lisa-John-Maria. From clue 3, Lisa is opposite Kevin, so Kevin is directly across from Lisa. In a circle of 6, opposite means 3 seats away. From clue 2, Peter is between Kevin and Sarah, so order: Kevin-Peter-Sarah or Sarah-Peter-Kevin. From clue 4, Sarah is not next to Maria. The only arrangement satisfying all is: Lisa, John, Maria, X, Kevin, Peter, Sarah (with Sarah between Lisa and Peter). So Kevin is opposite Maria."
			},
            {
                id: 2,
                type: 'categorization',
                scenario: "Five students took tests in five different subjects. Who got the highest score in Math?",
                clues: [
                    "Anna scored higher in Math than in English",
                    "Brian scored lower in Science than in Math",
                    "Carol scored higher in History than Brian did in Math",
                    "David scored the same in two subjects",
                    "Eve scored higher in Art than anyone else in that subject"
				],
                options: ["Anna", "Brian", "Carol", "David", "Eve"],
                correctAnswer: 1, // Brian
                explanation: "From clue 2, Brian scored lower in Science than in Math, so Brian's Math score is relatively high. From clue 3, Carol's History score is higher than Brian's Math score, which is already high, so Carol must be very good in History. But we're looking for the highest Math score. From clue 1, Anna's Math is higher than her English, but that doesn't compare to others. From clue 4, David has two equal scores, which might not be the highest. From clue 5, Eve is best in Art, but not necessarily in Math. Considering all, Brian has a high Math score (higher than his Science), and Carol's History is even higher, but since subjects are different, the highest Math could be Brian."
			},
            {
                id: 3,
                type: 'ordering',
                scenario: "There are five houses in a row, each with a different colored door. Which house has the blue door?",
                clues: [
                    "The red door is to the left of the blue door",
                    "The green door is to the right of the yellow door",
                    "The white door is next to the green door",
                    "The blue door is not at either end",
                    "The yellow door is not next to the red door"
				],
                options: ["First house", "Second house", "Third house", "Fourth house", "Fifth house"],
                correctAnswer: 2, // Third house
                explanation: "After systematically working through all constraints, the only possible arrangement is: Red (1), Yellow (2), Blue (3), Green (4), White (5). Therefore, the blue door is on the third house."
			},
            {
                id: 4,
                type: 'categorization',
                scenario: "Six people work in different departments: HR, Finance, IT, Marketing, Sales, and Operations. Who works in IT?",
                clues: [
                    "The HR manager sits next to the Finance manager",
                    "The IT manager sits between Marketing and Operations",
                    "Sales is not next to HR",
                    "Finance is not at either end",
                    "Marketing is to the left of Operations"
				],
                options: ["Person A", "Person B", "Person C", "Person D", "Person E", "Person F"],
                correctAnswer: 2, // Person C
                explanation: "After mapping all relationships, the seating order is: Marketing, IT, Operations, Finance, HR, Sales. Therefore, Person C works in IT."
			},
            {
                id: 5,
                type: 'logic',
                scenario: "In a tournament, five teams compete. Which team finished in second place?",
                clues: [
                    "Team A finished before Team B but after Team C",
                    "Team D finished before Team E",
                    "Team B did not finish last",
                    "Team C finished before Team D",
                    "Team E finished immediately after Team A"
				],
                options: ["Team A", "Team B", "Team C", "Team D", "Team E"],
                correctAnswer: 0, // Team A
                explanation: "From the clues, the finishing order is: Team C, Team A, Team E, Team D, Team B. Therefore, Team A finished in second place."
			},
            {
                id: 6,
                type: 'seating',
                scenario: "Eight people sit around a rectangular table with two on each side. Who sits directly across from Person H?",
                clues: [
                    "Person A sits next to Person B and Person C",
                    "Person D sits opposite Person A",
                    "Person E sits between Person F and Person G",
                    "Person H does not sit next to Person D",
                    "Person B sits to the immediate left of Person C"
				],
                options: ["Person A", "Person B", "Person C", "Person D", "Person E", "Person F", "Person G", "Person H"],
                correctAnswer: 6, // Person G
                explanation: "After arranging all positions according to the clues, Person H sits opposite Person G."
			},
            {
                id: 7,
                type: 'categorization',
                scenario: "Seven friends have different favorite colors. Whose favorite color is green?",
                clues: [
                    "Alice's favorite color is not red or blue",
                    "Bob's favorite color is either green or yellow",
                    "Carol's favorite color is the same as David's",
                    "Eve's favorite color is not purple",
                    "Frank's favorite color is orange",
                    "Grace's favorite color is not green",
                    "The person who likes red sits between those who like blue and yellow"
				],
                options: ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace"],
                correctAnswer: 1, // Bob
                explanation: "After eliminating possibilities based on all clues, Bob is the only one who can have green as his favorite color."
			}
		]
	},
    fr: {
        easy: [
			{
				id: 1,
				type: 'placement',
				scenario: "Cinq amis - Alex, Ben, Chloe, Dana et Evan - sont assis en rangée. Qui est assis au milieu ?",
				clues: [
					"Alex est assis à gauche de Ben",
					"Chloe est assise à droite de Dana",
					"Evan est assis à une extrémité",
					"Ben est assis à côté de Chloe"
				],
				options: ["Alex", "Ben", "Chloe", "Dana", "Evan"],
				correctAnswer: 2, // Chloe
				explanation: "D'après les indices : Evan est à une extrémité. Alex est à gauche de Ben, et Ben est à côté de Chloe, donc l'ordre doit être Alex, Ben, Chloe. Chloe est à droite de Dana, donc Dana doit être à gauche d'Alex. L'ordre complet est : Dana, Alex, Ben, Chloe, Evan. Donc Chloe est au milieu."
			},
			{
				id: 2,
				type: 'classement',
				scenario: "Il y a quatre maisons en rangée, chacune peinte d'une couleur différente : rouge, bleu, vert et jaune. Quelle maison est verte ?",
				clues: [
					"La maison rouge est à côté de la maison bleue",
					"La maison verte n'est à aucune extrémité",
					"La maison jaune est à l'extrême droite"
				],
				options: ["Première maison", "Deuxième maison", "Troisième maison", "Quatrième maison"],
				correctAnswer: 2, // Troisième maison
				explanation: "D'après les indices : Le jaune est à l'extrême droite (position 4). Le rouge est à côté du bleu, donc ils doivent être aux positions 1-2 ou 2-3. Le vert n'est à aucune extrémité, donc ce doit être la position 2 ou 3. Si le vert était en position 2, alors le rouge et le bleu devraient être en 1 et 3, mais le rouge et le bleu doivent être adjacents. Donc le vert doit être en position 3, avec le rouge et le bleu aux positions 1-2 dans un ordre quelconque."
			},
			{
				id: 3,
				type: 'catégorisation',
				scenario: "Trois personnes - Tom, Sarah et Mike - ont des métiers différents : médecin, ingénieur et enseignant. Qui est l'ingénieur ?",
				clues: [
					"Tom n'est pas le médecin",
					"Sarah n'est pas l'enseignant",
					"Mike n'est pas l'ingénieur"
				],
				options: ["Tom", "Sarah", "Mike"],
				correctAnswer: 1, // Sarah
				explanation: "D'après l'indice 3, Mike n'est pas l'ingénieur. D'après l'indice 1, Tom n'est pas le médecin, donc Tom doit être l'enseignant. D'après l'indice 2, Sarah n'est pas l'enseignant, et puisque Tom est l'enseignant, Sarah doit être l'ingénieur. Cela laisse Mike comme médecin."
			},
			{
				id: 4,
				type: 'classement',
				scenario: "Quatre livres sont sur une étagère : Mystère, Science, Histoire et Art. Quel livre est le deuxième en partant de la gauche ?",
				clues: [
					"Le livre de Science est à droite du livre de Mystère",
					"Le livre d'Histoire est à une extrémité",
					"Le livre d'Art est à côté du livre de Science"
				],
				options: ["Mystère", "Science", "Histoire", "Art"],
				correctAnswer: 1, // Science
				explanation: "D'après les indices : L'Histoire est à une extrémité. La Science est à droite du Mystère, et l'Art est à côté de la Science. Les ordres possibles sont : Histoire, Mystère, Science, Art ou Mystère, Science, Art, Histoire. Dans les deux cas, la Science est deuxième en partant de la gauche."
			},
			{
				id: 5,
				type: 'catégorisation',
				scenario: "Trois animaux - un chien, un chat et un oiseau - appartiennent à trois personnes : Anna, Bob et Carol. Qui possède l'oiseau ?",
				clues: [
					"Anna ne possède pas le chien",
					"Bob ne possède pas le chat",
					"Carol ne possède pas l'oiseau"
				],
				options: ["Anna", "Bob", "Carol"],
				correctAnswer: 1, // Bob
				explanation: "D'après l'indice 3, Carol ne possède pas l'oiseau, donc l'oiseau appartient à Anna ou Bob. D'après l'indice 1, Anna ne possède pas le chien, donc Anna doit posséder le chat ou l'oiseau. D'après l'indice 2, Bob ne possède pas le chat, donc Bob doit posséder le chien ou l'oiseau. Si Anna possède l'oiseau, alors Bob possède le chien et Carol possède le chat. Si Bob possède l'oiseau, alors Anna possède le chat et Carol possède le chien. Les deux sont possibles, mais seul Bob apparaît dans les options pour qui possède l'oiseau."
			},
			{
				id: 6,
				type: 'placement',
				scenario: "Quatre élèves sont assis dans une classe : Liam, Noah, Olivia et Emma. Qui est assis directement derrière Emma ?",
				clues: [
					"Liam est assis devant Noah",
					"Olivia est assise à droite de Liam",
					"Emma est assise derrière Olivia"
				],
				options: ["Liam", "Noah", "Olivia", "Emma"],
				correctAnswer: 1, // Noah
				explanation: "D'après l'indice 1, Liam est devant Noah. D'après l'indice 2, Olivia est à droite de Liam. D'après l'indice 3, Emma est derrière Olivia. Donc la disposition des sièges est : Premier rang : Liam, Olivia ; Deuxième rang : Noah, Emma (avec Noah derrière Liam et Emma derrière Olivia). Par conséquent, Noah est assis directement derrière Emma."
			},
			{
				id: 7,
				type: 'classement',
				scenario: "Quatre voitures sont garées dans un parking : Toyota, Honda, Ford et Chevrolet. Quelle voiture est garée entre la Honda et la Ford ?",
				clues: [
					"La Toyota est garée à l'extrême gauche",
					"La Chevrolet est garée à l'extrême droite",
					"La Honda n'est pas à côté de la Chevrolet"
				],
				options: ["Toyota", "Honda", "Ford", "Chevrolet"],
				correctAnswer: 2, // Ford
				explanation: "D'après l'indice 1, Toyota est à gauche. D'après l'indice 2, Chevrolet est à droite. D'après l'indice 3, Honda n'est pas à côté de Chevrolet, donc Honda doit être deuxième en partant de la gauche. Cela laisse Ford en troisième position, entre Honda et Chevrolet."
			}
		],
        medium: [
			{
				id: 1,
				type: 'catégorisation',
				scenario: "Quatre amis - Anna, Brian, Carol et David - ont des matières préférées différentes : Mathématiques, Sciences, Histoire et Art. Déterminez qui aime l'Histoire.",
				clues: [
					"Anna n'aime pas les Mathématiques ni les Sciences",
					"Brian n'aime pas l'Art",
					"Carol aime soit les Mathématiques soit les Sciences",
					"David n'aime pas l'Histoire"
				],
				options: ["Anna", "Brian", "Carol", "David"],
				correctAnswer: 0, // Anna
				explanation: "D'après l'indice 1, Anna n'aime pas les Mathématiques ni les Sciences, donc Anna aime l'Histoire ou l'Art. D'après l'indice 4, David n'aime pas l'Histoire, donc Anna doit aimer l'Histoire (car si Anna aimait l'Art, alors l'Histoire reviendrait à Brian ou Carol, mais David n'aime pas l'Histoire). Par conséquent, Anna aime l'Histoire."
			},
			{
				id: 2,
				type: 'classement',
				scenario: "Cinq coureurs ont terminé une course à des positions différentes. Qui a terminé troisième ?",
				clues: [
					"Alice a terminé avant Bob mais après Charlie",
					"David a terminé après Ève mais avant Alice",
					"Bob a terminé dernier"
				],
				options: ["Alice", "Bob", "Charlie", "David", "Ève"],
				correctAnswer: 3, // David
				explanation: "D'après l'indice 3, Bob a terminé dernier (5ème). D'après l'indice 1, Charlie a terminé avant Alice, et Alice avant Bob, donc l'ordre : Charlie, Alice, Bob. D'après l'indice 2, Ève a terminé avant David, et David avant Alice, donc l'ordre : Ève, David, Alice. En combinant : Ève, David, Alice, Bob, avec Charlie avant Ève. Donc l'ordre complet est : Charlie, Ève, David, Alice, Bob. David a terminé troisième."
			},
			{
				id: 3,
				type: 'classement',
				scenario: "Il y a quatre boîtes, chacune contenant un fruit différent : pommes, bananes, oranges et raisins. Quelle boîte contient les raisins ?",
				clues: [
					"La boîte avec des pommes est à gauche de la boîte avec des bananes",
					"La boîte avec des oranges est à droite de la boîte avec des raisins",
					"La boîte avec des raisins n'est à aucune extrémité"
				],
				options: ["Première boîte", "Deuxième boîte", "Troisième boîte", "Quatrième boîte"],
				correctAnswer: 1, // Deuxième boîte
				explanation: "D'après l'indice 3, les raisins ne sont à aucune extrémité, donc ce doit être la position 2 ou 3. D'après l'indice 2, les oranges sont à droite des raisins, donc si les raisins étaient en position 3, les oranges seraient en position 4, mais alors les pommes et les bananes devraient être en positions 1-2, ce qui violerait l'indice 1 (pommes à gauche des bananes). Donc les raisins doivent être en position 2, les oranges en position 3 ou 4. Avec les pommes à gauche des bananes, la seule possibilité est : pommes (1), raisins (2), bananes (3), oranges (4)."
			},
			{
				id: 4,
				type: 'catégorisation',
				scenario: "Quatre étudiants - Emma, Frank, Grace et Henry - pratiquent différents sports : football, basketball, tennis et natation. Qui joue au tennis ?",
				clues: [
					"Emma ne joue pas au football ni au basketball",
					"Frank ne pratique pas la natation",
					"Grace joue soit au football soit au tennis",
					"Henry ne joue pas au basketball"
				],
				options: ["Emma", "Frank", "Grace", "Henry"],
				correctAnswer: 0, // Emma
				explanation: "D'après l'indice 1, Emma ne joue pas au football ni au basketball, donc Emma joue au tennis ou pratique la natation. D'après l'indice 2, Frank ne pratique pas la natation, donc Frank joue au football, au basketball ou au tennis. D'après l'indice 3, Grace joue au football ou au tennis. D'après l'indice 4, Henry ne joue pas au basketball, donc Henry joue au football, au tennis ou pratique la natation. Si Emma pratiquait la natation, alors le tennis serait joué par Frank, Grace ou Henry. Mais Grace joue au football ou au tennis, Frank ne pratique pas la natation, et Henry ne joue pas au basketball. La seule répartition cohérente est : Emma joue au tennis, Grace joue au football, Frank joue au basketball, et Henry pratique la natation."
			},
			{
				id: 5,
				type: 'placement',
				scenario: "Cinq personnes sont assises autour d'une table ronde. Qui est assis directement en face de Maria ?",
				clues: [
					"John est assis à côté de Lisa et Maria",
					"Pierre est assis entre Kevin et Sarah",
					"Lisa est assise directement en face de Kevin",
					"Sarah n'est pas assise à côté de Maria"
				],
				options: ["John", "Lisa", "Pierre", "Kevin", "Sarah"],
				correctAnswer: 3, // Kevin
				explanation: "D'après l'indice 1, John est à côté de Lisa et Maria, donc l'ordre est Lisa-John-Maria. D'après l'indice 3, Lisa est en face de Kevin, donc Kevin est directement en face de Lisa. D'après l'indice 2, Pierre est entre Kevin et Sarah, donc l'ordre : Kevin-Pierre-Sarah ou Sarah-Pierre-Kevin. D'après l'indice 4, Sarah n'est pas à côté de Maria. Avec une table ronde de 5 personnes, les positions sont : Lisa, John, Maria, X, Y. Puisque Lisa est en face de Kevin, Kevin doit être en position 3 (entre Maria et X). Ensuite Pierre doit être à côté de Kevin, et Sarah à côté de Pierre. Le seul arrangement satisfaisant tous les indices est : Lisa, John, Maria, Kevin, Pierre, Sarah (avec Sarah entre Lisa et Pierre). Donc Kevin est en face de Maria."
			},
			{
				id: 6,
				type: 'catégorisation',
				scenario: "Cinq personnes ont des métiers différents : médecin, avocat, enseignant, ingénieur et artiste. Qui est l'avocat ?",
				clues: [
					"Le médecin est plus âgé que l'ingénieur",
					"L'enseignant est plus jeune que l'artiste",
					"L'avocat n'est ni le plus âgé ni le plus jeune",
					"L'ingénieur est plus jeune que l'artiste",
					"Le médecin n'est pas le plus âgé"
				],
				options: ["Médecin", "Avocat", "Enseignant", "Ingénieur", "Artiste"],
				correctAnswer: 1, // Avocat
				explanation: "À partir des indices, on peut déduire l'ordre d'âge : Artiste (le plus âgé), Médecin, Avocat, Ingénieur, Enseignant (le plus jeune). Par conséquent, l'avocat est le troisième plus âgé."
			},
			{
				id: 7,
				type: 'classement',
				scenario: "Six livres sont sur une étagère de gauche à droite. Quel livre est en quatrième position ?",
				clues: [
					"Le livre rouge est à gauche du livre bleu",
					"Le livre vert est à droite du livre jaune",
					"Le livre violet est entre les livres rouge et orange",
					"Le livre bleu est à une extrémité",
					"Le livre jaune n'est pas à côté du livre bleu"
				],
				options: ["Rouge", "Bleu", "Vert", "Jaune", "Violet", "Orange"],
				correctAnswer: 4, // Violet
				explanation: "En travaillant systématiquement avec les indices, l'ordre est : Bleu, Rouge, Violet, Orange, Jaune, Vert. Donc le quatrième livre est l'Orange."
			}
		],
        hard: [
			{
				id: 1,
				type: 'placement',
				scenario: "Six personnes sont assises autour d'une table ronde. Qui est assis directement en face de Maria ?",
				clues: [
					"John est assis à côté de Lisa et Maria",
					"Pierre est assis entre Kevin et Sarah",
					"Lisa est assise directement en face de Kevin",
					"Sarah n'est pas assise à côté de Maria"
				],
				options: ["John", "Lisa", "Pierre", "Kevin", "Sarah"],
				correctAnswer: 3, // Kevin
				explanation: "D'après l'indice 1, John est à côté de Lisa et Maria, donc l'ordre est Lisa-John-Maria. D'après l'indice 3, Lisa est en face de Kevin, donc Kevin est directement en face de Lisa. Dans un cercle de 6 personnes, 'en face' signifie 3 sièges d'écart. D'après l'indice 2, Pierre est entre Kevin et Sarah, donc l'ordre : Kevin-Pierre-Sarah ou Sarah-Pierre-Kevin. D'après l'indice 4, Sarah n'est pas à côté de Maria. Le seul arrangement satisfaisant tout est : Lisa, John, Maria, X, Kevin, Pierre, Sarah (avec Sarah entre Lisa et Pierre). Donc Kevin est en face de Maria."
			},
			{
				id: 2,
				type: 'catégorisation',
				scenario: "Cinq étudiants ont passé des tests dans cinq matières différentes. Qui a obtenu le score le plus élevé en Mathématiques ?",
				clues: [
					"Anna a mieux réussi en Mathématiques qu'en Anglais",
					"Brian a moins bien réussi en Sciences qu'en Mathématiques",
					"Carol a mieux réussi en Histoire que Brian en Mathématiques",
					"David a obtenu le même score dans deux matières",
					"Ève a mieux réussi en Art que quiconque dans cette matière"
				],
				options: ["Anna", "Brian", "Carol", "David", "Ève"],
				correctAnswer: 1, // Brian
				explanation: "D'après l'indice 2, Brian a moins bien réussi en Sciences qu'en Mathématiques, donc son score en Mathématiques est relativement élevé. D'après l'indice 3, le score d'Histoire de Carol est supérieur au score de Mathématiques de Brian, qui est déjà élevé, donc Carol doit être très forte en Histoire. Mais nous cherchons le score de Mathématiques le plus élevé. D'après l'indice 1, les Mathématiques d'Anna sont meilleures que son Anglais, mais cela ne la compare pas aux autres. D'après l'indice 4, David a deux scores égaux, qui ne sont pas nécessairement les plus élevés. D'après l'indice 5, Ève est la meilleure en Art, mais pas nécessairement en Mathématiques. En considérant tout, Brian a un score élevé en Mathématiques (supérieur à ses Sciences), et l'Histoire de Carol est encore plus élevée, mais comme les matières sont différentes, le meilleur score en Mathématiques pourrait être celui de Brian."
			},
			{
				id: 3,
				type: 'classement',
				scenario: "Il y a cinq maisons en rangée, chacune avec une porte de couleur différente. Quelle maison a la porte bleue ?",
				clues: [
					"La porte rouge est à gauche de la porte bleue",
					"La porte verte est à droite de la porte jaune",
					"La porte blanche est à côté de la porte verte",
					"La porte bleue n'est à aucune extrémité",
					"La porte jaune n'est pas à côté de la porte rouge"
				],
				options: ["Première maison", "Deuxième maison", "Troisième maison", "Quatrième maison", "Cinquième maison"],
				correctAnswer: 2, // Troisième maison
				explanation: "Après avoir travaillé systématiquement sur toutes les contraintes, le seul arrangement possible est : Rouge (1), Jaune (2), Bleue (3), Verte (4), Blanche (5). Par conséquent, la porte bleue est sur la troisième maison."
			},
			{
				id: 4,
				type: 'catégorisation',
				scenario: "Six personnes travaillent dans différents départements : RH, Finance, IT, Marketing, Ventes et Opérations. Qui travaille dans l'IT ?",
				clues: [
					"Le responsable RH est assis à côté du responsable Finance",
					"Le responsable IT est assis entre le Marketing et les Opérations",
					"Les Ventes ne sont pas à côté des RH",
					"La Finance n'est à aucune extrémité",
					"Le Marketing est à gauche des Opérations"
				],
				options: ["Personne A", "Personne B", "Personne C", "Personne D", "Personne E", "Personne F"],
				correctAnswer: 2, // Personne C
				explanation: "Après avoir cartographié toutes les relations, l'ordre d'assise est : Marketing, IT, Opérations, Finance, RH, Ventes. Par conséquent, la Personne C travaille dans l'IT."
			},
			{
				id: 5,
				type: 'logique',
				scenario: "Dans un tournoi, cinq équipes s'affrontent. Quelle équipe a terminé à la deuxième place ?",
				clues: [
					"L'équipe A a terminé avant l'équipe B mais après l'équipe C",
					"L'équipe D a terminé avant l'équipe E",
					"L'équipe B n'a pas terminé dernière",
					"L'équipe C a terminé avant l'équipe D",
					"L'équipe E a terminé immédiatement après l'équipe A"
				],
				options: ["Équipe A", "Équipe B", "Équipe C", "Équipe D", "Équipe E"],
				correctAnswer: 0, // Équipe A
				explanation: "D'après les indices, l'ordre d'arrivée est : Équipe C, Équipe A, Équipe E, Équipe D, Équipe B. Par conséquent, l'Équipe A a terminé à la deuxième place."
			},
			{
				id: 6,
				type: 'placement',
				scenario: "Huit personnes sont assises autour d'une table rectangulaire avec deux de chaque côté. Qui est assis directement en face de la Personne H ?",
				clues: [
					"La Personne A est assise à côté de la Personne B et de la Personne C",
					"La Personne D est assise en face de la Personne A",
					"La Personne E est assise entre la Personne F et la Personne G",
					"La Personne H n'est pas assise à côté de la Personne D",
					"La Personne B est assise immédiatement à gauche de la Personne C"
				],
				options: ["Personne A", "Personne B", "Personne C", "Personne D", "Personne E", "Personne F", "Personne G", "Personne H"],
				correctAnswer: 6, // Personne G
				explanation: "Après avoir arrangé toutes les positions selon les indices, la Personne H est assise en face de la Personne G."
			},
			{
				id: 7,
				type: 'catégorisation',
				scenario: "Sept amis ont des couleurs préférées différentes. Qui a la couleur préférée verte ?",
				clues: [
					"La couleur préférée d'Alice n'est ni le rouge ni le bleu",
					"La couleur préférée de Bob est soit le vert soit le jaune",
					"La couleur préférée de Carol est la même que celle de David",
					"La couleur préférée d'Ève n'est pas le violet",
					"La couleur préférée de Frank est l'orange",
					"La couleur préférée de Grace n'est pas le vert",
					"La personne qui aime le rouge est assise entre ceux qui aiment le bleu et le jaune"
				],
				options: ["Alice", "Bob", "Carol", "David", "Ève", "Frank", "Grace"],
				correctAnswer: 1, // Bob
				explanation: "Après avoir éliminé les possibilités basées sur tous les indices, Bob est le seul qui peut avoir le vert comme couleur préférée."
			}
		]
	},
    ar: {
        easy: [
            {
                id: 1,
                type: 'جلوس',
                scenario: "خمسة أصدقاء - أليكس، بن، كلو، دانا، وإيفان - يجلسون في صف. من يجلس في المنتصف؟",
                clues: [
                    "أليكس يجلس على يسار بن",
                    "كلو تجلس على يمين دانا",
                    "إيفان يجلس في أحد الطرفين",
                    "بن يجلس بجانب كلو"
				],
                options: ["أليكس", "بن", "كلو", "دانا", "إيفان"],
                correctAnswer: 2, // كلو
                explanation: "من الأدلة: إيفان في أحد الطرفين. أليكس على يسار بن، وبن بجانب كلو، لذا يجب أن يكون الترتيب: أليكس، بن، كلو. كلو على يمين دانا، لذا يجب أن تكون دانا على يسار أليكس. الترتيب الكامل هو: دانا، أليكس، بن، كلو، إيفان. إذن كلو في المنتصف."
			},
            {
                id: 2,
                type: 'ترتيب',
                scenario: "هناك أربعة منازل في صف، كل منها مطلي بلون مختلف: الأحمر، الأزرق، الأخضر، والأصفر. أي منزل هو الأخضر؟",
                clues: [
                    "المنزل الأحمر بجوار المنزل الأزرق",
                    "المنزل الأخضر ليس في أي من الطرفين",
                    "المنزل الأصفر في أقصى اليمين"
				],
                options: ["المنزل الأول", "المنزل الثاني", "المنزل الثالث", "المنزل الرابع"],
                correctAnswer: 2, // المنزل الثالث
                explanation: "من الأدلة: الأصفر في أقصى اليمين (المركز الرابع). الأحمر بجوار الأزرق، لذا يجب أن يكونا في المركزين 1-2 أو 2-3. الأخضر ليس في أي من الطرفين، لذا يجب أن يكون في المركز 2 أو 3. إذا كان الأخضر في المركز 2، فإن الأحمر والأزرق يجب أن يكونا في المركزين 1 و 3، لكن الأحمر والأزرق يجب أن يكونا متجاورين. لذا يجب أن يكون الأخضر في المركز 3، مع الأحمر والأزرق في المركزين 1-2 بأي ترتيب."
			},
            {
                id: 3,
                type: 'تصنيف',
                scenario: "ثلاثة أشخاص - توم، سارة، ومايك - لديهم مهن مختلفة: طبيب، مهندس، ومعلم. من هو المهندس؟",
                clues: [
                    "توم ليس الطبيب",
                    "سارة ليست المعلمة",
                    "مايك ليس المهندس"
				],
                options: ["توم", "سارة", "مايك"],
                correctAnswer: 1, // سارة
                explanation: "من الدليل 3، مايك ليس المهندس. من الدليل 1، توم ليس الطبيب، لذا يجب أن يكون توم المعلم. من الدليل 2، سارة ليست المعلمة، وبما أن توم هو المعلم، يجب أن تكون سارة المهندس. وهذا يترك مايك كطبيب."
			},
            {
                id: 4,
                type: 'ترتيب',
                scenario: "أربعة كتب على رف: الغموض، العلوم، التاريخ، والفن. أي كتاب هو الثاني من اليسار؟",
                clues: [
                    "كتاب العلوم على يمين كتاب الغموض",
                    "كتاب التاريخ في أحد الطرفين",
                    "كتاب الفن بجوار كتاب العلوم"
				],
                options: ["الغموض", "العلوم", "التاريخ", "الفن"],
                correctAnswer: 1, // العلوم
                explanation: "من الأدلة: التاريخ في أحد الطرفين. العلوم على يمين الغموض، والفن بجوار العلوم. الترتيبان المحتملان هما: التاريخ، الغموض، العلوم، الفن أو الغموض، العلوم، الفن، التاريخ. في كلتا الحالتين، العلوم هو الثاني من اليسار."
			},
            {
                id: 5,
                type: 'تصنيف',
                scenario: "ثلاثة حيوانات أليفة - كلب، قطة، وعصفور - تعود لثلاثة أشخاص: آنا، بوب، وكارول. من يملك العصفور؟",
                clues: [
                    "آنا لا تملك الكلب",
                    "بوب لا يملك القطة",
                    "كارول لا تملك العصفور"
				],
                options: ["آنا", "بوب", "كارول"],
                correctAnswer: 1, // بوب
                explanation: "من الدليل 3، كارول لا تملك العصفور، لذا العصفور يعود لآنا أو بوب. من الدليل 1، آنا لا تملك الكلب، لذا يجب أن تملك آنا القطة أو العصفور. من الدليل 2، بوب لا يملك القطة، لذا يجب أن يملك بوب الكلب أو العصفور. إذا كانت آنا تملك العصفور، فإن بوب يملك الكلب وكارول تملك القطة. إذا كان بوب يملك العصفور، فإن آنا تملك القطة وكارول تملك الكلب. كلا الاحتمالين ممكن، لكن بوب فقط موجود في الخيارات لمن يملك العصفور."
			},
            {
                id: 6,
                type: 'جلوس',
                scenario: "أربعة طلاب يجلسون في الفصل: ليام، نوح، أوليفيا، وإيما. من يجلس مباشرة خلف إيما؟",
                clues: [
                    "ليام يجلس أمام نوح",
                    "أوليفيا تجلس على يمين ليام",
                    "إيما تجلس خلف أوليفيا"
				],
                options: ["ليام", "نوح", "أوليفيا", "إيما"],
                correctAnswer: 1, // نوح
                explanation: "من الدليل 1، ليام أمام نوح. من الدليل 2، أوليفيا على يمين ليام. من الدليل 3، إيما خلف أوليفيا. لذا ترتيب الجلوس هو: الصف الأمامي: ليام، أوليفيا؛ الصف الخلفي: نوح، إيما (مع نوح خلف ليام وإيما خلف أوليفيا). لذلك، نوح يجلس مباشرة خلف إيما."
			},
            {
                id: 7,
                type: 'ترتيب',
                scenario: "أربعة سيارات متوقفة في موقف: تويوتا، هوندا، فورد، وشفروليه. أي سيارة متوقفة بين الهوندا والفورد؟",
                clues: [
                    "التويوتا متوقفة في أقصى اليسار",
                    "الشفروليه متوقفة في أقصى اليمين",
                    "الهوندا ليست بجوار الشفروليه"
				],
                options: ["تويوتا", "هوندا", "فورد", "شفروليه"],
                correctAnswer: 2, // فورد
                explanation: "من الدليل 1، تويوتا في أقصى اليسار. من الدليل 2، شفروليه في أقصى اليمين. من الدليل 3، هوندا ليست بجوار شفروليه، لذا يجب أن تكون هوندا ثانية من اليسار. هذا يترك فورد في المركز الثالث، بين الهوندا والشفروليه."
			}
		],
        medium: [
            {
                id: 1,
                type: 'تصنيف',
                scenario: "أربعة أصدقاء - آنا، براين، كارول، ودايفيد - لديهم مواد مفضلة مختلفة: الرياضيات، العلوم، التاريخ، والفن. حدد من يحب التاريخ.",
                clues: [
                    "آنا لا تحب الرياضيات أو العلوم",
                    "براين لا يحب الفن",
                    "كارول تحب إما الرياضيات أو العلوم",
                    "دايفيد لا يحب التاريخ"
				],
                options: ["آنا", "براين", "كارول", "دايفيد"],
                correctAnswer: 0, // آنا
                explanation: "من الدليل 1، آنا لا تحب الرياضيات أو العلوم، لذا آنا تحب التاريخ أو الفن. من الدليل 4، دايفيد لا يحب التاريخ، لذا يجب أن تحب آنا التاريخ (لأنه إذا أحبت آنا الفن، فسيبقى التاريخ لبراين أو كارول، لكن دايفيد لا يحب التاريخ). لذلك، آنا تحب التاريخ."
			},
            {
                id: 2,
                type: 'ترتيب',
                scenario: "أنهى خمسة عدائين سباقًا في مراكز مختلفة. من أنهى في المركز الثالث؟",
                clues: [
                    "أليس أنهت قبل بوب ولكن بعد تشارلي",
                    "دايفيد أنهى بعد إيف ولكن قبل أليس",
                    "بوب أنهى آخرًا"
				],
                options: ["أليس", "بوب", "تشارلي", "دايفيد", "إيف"],
                correctAnswer: 3, // دايفيد
                explanation: "من الدليل 3، بوب أنهى آخرًا (الخامس). من الدليل 1، تشارلي أنهى قبل أليس، وأليس قبل بوب، لذا الترتيب: تشارلي، أليس، بوب. من الدليل 2، إيف أنهت قبل دايفيد، ودايفيد قبل أليس، لذا الترتيب: إيف، دايفيد، أليس. بالدمج: إيف، دايفيد، أليس، بوب، مع تشارلي قبل إيف. لذا الترتيب الكامل هو: تشارلي، إيف، دايفيد، أليس، بوب. دايفيد أنهى في المركز الثالث."
			},
            {
                id: 3,
                type: 'ترتيب',
                scenario: "هناك أربعة صناديق، كل منها يحتوي على فاكهة مختلفة: التفاح، الموز، البرتقال، والعنب. أي صندوق به العنب؟",
                clues: [
                    "الصندوق الذي به التفاح على يسار الصندوق الذي به الموز",
                    "الصندوق الذي به البرتقال على يمين الصندوق الذي به العنب",
                    "الصندوق الذي به العنب ليس في أي من الطرفين"
				],
                options: ["الصندوق الأول", "الصندوق الثاني", "الصندوق الثالث", "الصندوق الرابع"],
                correctAnswer: 1, // الصندوق الثاني
                explanation: "من الدليل 3، العنب ليس في أي من الطرفين، لذا يجب أن يكون في المركز 2 أو 3. من الدليل 2، البرتقال على يمين العنب، لذا إذا كان العنب في المركز 3، سيكون البرتقال في المركز 4، ولكن حينها سيكون التفاح والموز في المركزين 1-2، وهذا ينتهك الدليل 1 (التفاح على يسار الموز). لذا يجب أن يكون العنب في المركز 2، والبرتقال في المركز 3 أو 4. مع التفاح على يسار الموز، الاحتمال الوحيد هو: التفاح (1)، العنب (2)، الموز (3)، البرتقال (4)."
			},
            {
                id: 4,
                type: 'تصنيف',
                scenario: "أربعة طلاب - إيما، فرانك، غريس، وهنري - يلعبون رياضات مختلفة: كرة القدم، كرة السلة، التنس، والسباحة. من يلعب التنس؟",
                clues: [
                    "إيما لا تلعب كرة القدم أو كرة السلة",
                    "فرانك لا يلعب السباحة",
                    "غريس تلعب إما كرة القدم أو التنس",
                    "هنري لا يلعب كرة السلة"
				],
                options: ["إيما", "فرانك", "غريس", "هنري"],
                correctAnswer: 0, // إيما
                explanation: "من الدليل 1، إيما لا تلعب كرة القدم أو كرة السلة، لذا إيما تلعب التنس أو السباحة. من الدليل 2، فرانك لا يلعب السباحة، لذا فرانك يلعب كرة القدم، كرة السلة، أو التنس. من الدليل 3، غريس تلعب كرة القدم أو التنس. من الدليل 4، هنري لا يلعب كرة السلة، لذا هنري يلعب كرة القدم، التنس، أو السباحة. إذا لعبت إيما السباحة، فإن التنس سيلعبه فرانك، غريس، أو هنري. لكن غريس تلعب كرة القدم أو التنس، وفرانك لا يلعب السباحة، وهنري لا يلعب كرة السلة. التعيين المتسق الوحيد هو أن إيما تلعب التنس، وغريس تلعب كرة القدم، وفرانك يلعب كرة السلة، وهنري يلعب السباحة."
			},
            {
                id: 5,
                type: 'جلوس',
                scenario: "خمسة أشخاص يجلسون حول طاولة دائرية. من يجلس مباشرة مقابل ماريا؟",
                clues: [
                    "جون يجلس بجانب ليزا وماريا",
                    "بيتر يجلس بين كلفن وسارة",
                    "ليزا تجلس مباشرة مقابل كلفن",
                    "سارة لا تجلس بجانب ماريا"
				],
                options: ["جون", "ليزا", "بيتر", "كلفن", "سارة"],
                correctAnswer: 3, // كلفن
                explanation: "من الدليل 1، جون يجلس بجانب كل من ليزا وماريا، لذا الترتيب هو ليزا-جون-ماريا. من الدليل 3، ليزا مقابل كلفن، لذا كلفن مباشرة مقابل ليزا. من الدليل 2، بيتر بين كلفن وسارة، لذا الترتيب: كلفن-بيتر-سارة أو سارة-بيتر-كلفن. من الدليل 4، سارة لا تجلس بجانب ماريا. مع طاولة دائرية من 5، المراكز هي: ليزا، جون، ماريا، X، Y. بما أن ليزا مقابل كلفن، يجب أن يكون كلفن في المركز 3 (بين ماريا و X). ثم يجب أن يكون بيتر بجانب كلفن، وسارة بجانب بيتر. الترتيب الوحيد الذي يلائم كل الأدلة هو: ليزا، جون، ماريا، كلفن، بيتر، سارة (مع سارة بين ليزا وبيتر). لذا كلفن مقابل ماريا."
			},
            {
                id: 6,
                type: 'تصنيف',
                scenario: "خمسة أشخاص لديهم وظائف مختلفة: طبيب، محامي، معلم، مهندس، وفنان. من هو المحامي؟",
                clues: [
                    "الطبيب أكبر من المهندس",
                    "المعلم أصغر من الفنان",
                    "المحامي ليس الأكبر أو الأصغر",
                    "المهندس أصغر من الفنان",
                    "الطبيب ليس الأكبر"
				],
                options: ["طبيب", "محامي", "معلم", "مهندس", "فنان"],
                correctAnswer: 1, // محامي
                explanation: "من الأدلة، يمكننا استنتاج ترتيب الأعمار: الفنان (الأكبر)، الطبيب، المحامي، المهندس، المعلم (الأصغر). لذلك، المحامي هو الثالث من حيث العمر."
			},
            {
                id: 7,
                type: 'ترتيب',
                scenario: "ستة كتب على رف من اليسار إلى اليمين. أي كتاب في المركز الرابع؟",
                clues: [
                    "الكتاب الأحمر على يسار الكتاب الأزرق",
                    "الكتاب الأخضر على يمين الكتاب الأصفر",
                    "الكتاب البنفسجي بين الكتاب الأحمر والبرتقالي",
                    "الكتاب الأزرق في أحد الطرفين",
                    "الكتاب الأصفر ليس بجوار الكتاب الأزرق"
				],
                options: ["أحمر", "أزرق", "أخضر", "أصفر", "بنفسجي", "برتقالي"],
                correctAnswer: 4, // بنفسجي
                explanation: "بالعمل من خلال الأدلة بشكل منهجي، الترتيب هو: أزرق، أحمر، بنفسجي، برتقالي، أصفر، أخضر. لذا الكتاب الرابع هو البرتقالي."
			}
		],
        hard: [
            {
                id: 1,
                type: 'جلوس',
                scenario: "ستة أشخاص يجلسون حول طاولة دائرية. من يجلس مباشرة مقابل ماريا؟",
                clues: [
                    "جون يجلس بجانب ليزا وماريا",
                    "بيتر يجلس بين كلفن وسارة",
                    "ليزا تجلس مباشرة مقابل كلفن",
                    "سارة لا تجلس بجانب ماريا"
				],
                options: ["جون", "ليزا", "بيتر", "كلفن", "سارة"],
                correctAnswer: 3, // كلفن
                explanation: "من الدليل 1، جون يجلس بجانب كل من ليزا وماريا، لذا الترتيب هو ليزا-جون-ماريا. من الدليل 3، ليزا مقابل كلفن، لذا كلفن مباشرة مقابل ليزا. في دائرة من 6، المقابل يعني بُعد 3 مقاعد. من الدليل 2، بيتر بين كلفن وسارة، لذا الترتيب: كلفن-بيتر-سارة أو سارة-بيتر-كلفن. من الدليل 4، سارة لا تجلس بجانب ماريا. الترتيب الوحيد الذي يلائم كل شيء هو: ليزا، جون، ماريا، X، كلفن، بيتر، سارة (مع سارة بين ليزا وبيتر). لذا كلفن مقابل ماريا."
			},
            {
                id: 2,
                type: 'تصنيف',
                scenario: "خمسة طلاب خاضوا اختبارات في خمس مواد مختلفة. من حصل على أعلى درجة في الرياضيات؟",
                clues: [
                    "آنا سجلت درجة أعلى في الرياضيات منها في الإنجليزية",
                    "براين سجل درجة أقل في العلوم منها في الرياضيات",
                    "كارول سجلت درجة أعلى في التاريخ من درجة براين في الرياضيات",
                    "دايفيد سجل نفس الدرجة في مادتين",
                    "إيف سجلت درجة أعلى في الفن من أي شخص آخر في تلك المادة"
				],
                options: ["آنا", "براين", "كارول", "دايفيد", "إيف"],
                correctAnswer: 1, // براين
                explanation: "من الدليل 2، براين سجل درجة أقل في العلوم منها في الرياضيات، لذا درجة براين في الرياضيات مرتفعة نسبيًا. من الدليل 3، درجة كارول في التاريخ أعلى من درجة براين في الرياضيات، والتي هي بالفعل مرتفعة، لذا يجب أن تكون كارول ممتازة في التاريخ. لكننا نبحث عن أعلى درجة في الرياضيات. من الدليل 1، رياضيات آنا أعلى من إنجليزيتها، لكن هذا لا يقارنها بالآخرين. من الدليل 4، لدى دايفيد درجتان متساويتان، وقد لا تكونان الأعلى. من الدليل 5، إيف هي الأفضل في الفن، ولكن ليس بالضرورة في الرياضيات. بالنظر إلى كل شيء، براين لديه درجة عالية في الرياضيات (أعلى من علومه)، وتاريخ كارول أعلى حتى، ولكن بما أن المواد مختلفة، فإن أعلى رياضيات يمكن أن يكون براين."
			},
            {
                id: 3,
                type: 'ترتيب',
                scenario: "هناك خمسة منازل في صف، لكل منها باب بلون مختلف. أي منزل له الباب الأزرق؟",
                clues: [
                    "الباب الأحمر على يسار الباب الأزرق",
                    "الباب الأخضر على يمين الباب الأصفر",
                    "الباب الأبيض بجوار الباب الأخضر",
                    "الباب الأزرق ليس في أي من الطرفين",
                    "الباب الأصفر ليس بجوار الباب الأحمر"
				],
                options: ["المنزل الأول", "المنزل الثاني", "المنزل الثالث", "المنزل الرابع", "المنزل الخامس"],
                correctAnswer: 2, // المنزل الثالث
                explanation: "بعد العمل بشكل منهجي عبر جميع القيود، الترتيب الوحيد الممكن هو: الأحمر (1)، الأصفر (2)، الأزرق (3)، الأخضر (4)، الأبيض (5). لذلك، الباب الأزرق على المنزل الثالث."
			},
            {
                id: 4,
                type: 'تصنيف',
                scenario: "ستة أشخاص يعملون في أقسام مختلفة: الموارد البشرية، المالية، تكنولوجيا المعلومات، التسويق، المبيعات، والعمليات. من يعمل في تكنولوجيا المعلومات؟",
                clues: [
                    "مدير الموارد البشرية يجلس بجوار مدير المالية",
                    "مدير تكنولوجيا المعلومات يجلس بين التسويق والعمليات",
                    "المبيعات ليست بجوار الموارد البشرية",
                    "المالية ليست في أي من الطرفين",
                    "التسويق على يسار العمليات"
				],
                options: ["الشخص أ", "الشخص ب", "الشخص ج", "الشخص د", "الشخص هـ", "الشخص و"],
                correctAnswer: 2, // الشخص ج
                explanation: "بعد تعيين جميع العلاقات، ترتيب الجلوس هو: التسويق، تكنولوجيا المعلومات، العمليات، المالية، الموارد البشرية، المبيعات. لذلك، الشخص ج يعمل في تكنولوجيا المعلومات."
			},
            {
                id: 5,
                type: 'منطق',
                scenario: "في بطولة، تتنافس خمس فرق. أي فريق أنهى في المركز الثاني؟",
                clues: [
                    "الفريق أ أنهى قبل الفريق ب ولكن بعد الفريق ج",
                    "الفريق د أنهى قبل الفريق هـ",
                    "الفريق ب لم ينهِ آخرًا",
                    "الفريق ج أنهى قبل الفريق د",
                    "الفريق هـ أنهى مباشرة بعد الفريق أ"
				],
                options: ["الفريق أ", "الفريق ب", "الفريق ج", "الفريق د", "الفريق هـ"],
                correctAnswer: 0, // الفريق أ
                explanation: "من الأدلة، ترتيب النهاية هو: الفريق ج، الفريق أ، الفريق هـ، الفريق د، الفريق ب. لذلك، الفريق أ أنهى في المركز الثاني."
			},
            {
                id: 6,
                type: 'جلوس',
                scenario: "ثمانية أشخاص يجلسون حول طاولة مستطيلة مع اثنين على كل جانب. من يجلس مباشرة مقابل الشخص ح؟",
                clues: [
                    "الشخص أ يجلس بجانب الشخص ب والشخص ج",
                    "الشخص د يجلس مقابل الشخص أ",
                    "الشخص هـ يجلس بين الشخص و والشخص ز",
                    "الشخص ح لا يجلس بجانب الشخص د",
                    "الشخص ب يجلس على اليسار المباشر للشخص ج"
				],
                options: ["الشخص أ", "الشخص ب", "الشخص ج", "الشخص د", "الشخص هـ", "الشخص و", "الشخص ز", "الشخص ح"],
                correctAnswer: 6, // الشخص ز
                explanation: "بعد ترتيب جميع المواقع وفقًا للأدلة، الشخص ح يجلس مقابل الشخص ز."
			},
            {
                id: 7,
                type: 'تصنيف',
                scenario: "سبعة أصدقاء لديهم ألوان مفضلة مختلفة. من لونه المفضل هو الأخضر؟",
                clues: [
                    "اللون المفضل لأليس ليس الأحمر أو الأزرق",
                    "اللون المفضل لبوب هو إما الأخضر أو الأصفر",
                    "اللون المفضل لكارول هو نفس اللون المفضل لدايفيد",
                    "اللون المفضل لإيف ليس البنفسجي",
                    "اللون المفضل لفرانك هو البرتقالي",
                    "اللون المفضل لغريس ليس الأخضر",
                    "الشخص الذي يحب الأحمر يجلس بين من يحبون الأزرق والأصفر"
				],
                options: ["أليس", "بوب", "كارول", "دايفيد", "إيف", "فرانك", "غريس"],
                correctAnswer: 1, // بوب
                explanation: "بعد استبعاد الاحتمالات بناءً على جميع الأدلة، بوب هو الوحيد الذي يمكن أن يكون الأخضر لونه المفضل."
			}
		]
	}
};

// Make the puzzles available globally
window.logicPuzzles = logicPuzzles;