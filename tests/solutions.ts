// Une solution de référence par énigme. Elles ne servent pas à jouer : elles servent à
// prouver que chaque serrure peut s'ouvrir, avec le harnais qui est réellement livré.
import { c } from '../src/contenu/c';

export const SOLUTIONS: Record<string, string> = {
  'hall-bonsoir': c`
    #include <stdio.h>

    int	main(void)
    {
        printf("BONSOIR SEVERIN\n");
        return (0);
    }
  `,

  'bureau-tri': c`
    void	ft_trier(int *tab, int taille)
    {
        int	i;
        int	j;
        int	tmp;

        i = 0;
        while (i < taille)
        {
            j = i + 1;
            while (j < taille)
            {
                if (tab[j] < tab[i])
                {
                    tmp = tab[i];
                    tab[i] = tab[j];
                    tab[j] = tmp;
                }
                j++;
            }
            i++;
        }
    }
  `,

  'biblio-strrev': c`
    int	ft_strlen(char *s)
    {
        int	i;

        i = 0;
        while (s[i])
            i++;
        return (i);
    }

    char	*ft_strrev(char *s)
    {
        int	i;
        int	j;
        char	tmp;

        i = 0;
        j = ft_strlen(s) - 1;
        while (i < j)
        {
            tmp = s[i];
            s[i] = s[j];
            s[j] = tmp;
            i++;
            j--;
        }
        return (s);
    }
  `,

  'chambre-swap': c`
    void	ft_swap(char *a, char *b)
    {
        char	tmp;

        tmp = *a;
        *a = *b;
        *b = tmp;
    }
  `,

  'atelier-binaire': c`
    int	ft_binaire(char *bits)
    {
        int	n;
        int	i;

        n = 0;
        i = 0;
        while (bits[i])
        {
            n = n * 2 + (bits[i] - '0');
            i++;
        }
        return (n);
    }
  `,

  'cave-strdup': c`
    #include <stdlib.h>

    int	ft_strlen(char *s)
    {
        int	i;

        i = 0;
        while (s[i])
            i++;
        return (i);
    }

    char	*ft_strdup(char *src)
    {
        char	*copie;
        int	i;

        copie = malloc(ft_strlen(src) + 1);
        if (!copie)
            return (NULL);
        i = 0;
        while (src[i])
        {
            copie[i] = src[i];
            i++;
        }
        copie[i] = '\0';
        return (copie);
    }
  `,

  'grenier-recursion': c`
    int	ft_factorielle(int n)
    {
        if (n <= 1)
            return (1);
        return (n * ft_factorielle(n - 1));
    }
  `,

  'testament-norme': c`
    #include <stdio.h>

    int	main(void)
    {
        char	*mot;
        int	i;

        mot = "AUBE";
        i = 0;
        while (i < 4)
        {
            printf("%c", mot[i]);
            i++;
        }
        printf("\n");
        return (0);
    }
  `,
};
