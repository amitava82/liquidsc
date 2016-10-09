const app = 'wavy';

export default function (module, constants) {
       return constants.map(i => {
           return `${app}/${module}/${i}`;
       });
}